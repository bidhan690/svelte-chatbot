import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import type { Message } from "$lib/types/message";
import type { Writable } from "svelte/store";
export type ChatGPTAgent = "user" | "system";
export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export async function OpenAIStream(
  payload: OpenAIStreamPayload,
  api: string
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const { error } = await res.json();
      console.log(error);
      throw new Error("Openai error");
    }
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        // callback
        function onParse(event: ParsedEvent | ReconnectInterval) {
          if (event.type === "event") {
            const data = event.data;
            // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta?.content || "";

              if (counter < 2 && (text.match(/\n/) || []).length) {
                // this is a prefix character (i.e., "\n\n"), do nothing
                return;
              }
              const queue = encoder.encode(text);
              controller.enqueue(queue);
              counter++;
            } catch (e) {
              // maybe parse error
              controller.error(e);
            }
          }
        }

        // stream response (SSE) from OpenAI may be fragmented into multiple chunks
        // this ensures we properly read chunks and invoke an event for each SSE event stream
        const parser = createParser(onParse);
        // https://web.dev/streams/#asynchronous-iteration
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });

    return stream;
  } catch (err) {
    throw err;
  }
}

export const processDataChunk = async (
  text: string,
  messages: Writable<Message[]>,
  reader: ReadableStreamDefaultReader<Uint8Array>
) => {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = new TextDecoder("utf-8").decode(value);
    text += chunk; // accumulate the streamed data

    // Update the 'text' property of the 'data' object
    messages.update((prev: Message[]) => {
      const updatedData = {
        ...prev[prev.length - 1], // Get the last message object
        text: text, // Update the text property with the accumulated data
      };
      return [...prev.slice(0, -1), updatedData]; // Replace the last message object with the updated one
    });
  }
};

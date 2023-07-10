<script lang="ts">
  import { cn } from "$lib/validators/utils";
  import { nanoid } from "nanoid";
  import { messages } from "$lib/stores/messages";
  import { processDataChunk } from "$lib/constant/openai-stream";
  import Textareaautosize from "../Textareaautosize.svelte";
  import type { Message } from "$lib/types/message";
  export let className: string;

  let input = "";
  let isLoading = false;
  let error = "";

  async function sendMessage() {
    error = "";
    isLoading = true;
    messages.update((prev) => [
      ...prev,
      {
        id: nanoid(),
        isUserMessage: true,
        text: input,
      },
    ]);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ message: $messages }), // Send the input message as the body
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      if (!res.ok) {
        throw new Error("Something went wrong. Please try again later!");
      }
      const reader = res.body!.getReader();

      let text = "";
      const data: Message = {
        id: nanoid(),
        isUserMessage: false,
        text: "", // Empty initial text
      };
      messages.update((prev) => [...prev, data]);

      processDataChunk(text, messages, reader);
    } catch (err) {
      error = "Something went wrong. Please try again later!";
    }

    isLoading = false;
    input = "";
  }
</script>

{#if error}
  <p class="text-xs text-center w-full text-red-600">{error}</p>
{/if}

<div class={cn("border-t border-zinc-300 ", className)}>
  <div
    class="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none"
  >
    <Textareaautosize
      bind:value={input}
      on:keydown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();

          sendMessage();
        }
      }}
      rows={1}
      disabled={isLoading}
      placeholder="Write a message...."
      class="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6"
    />

    <div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
      <kbd
        class="inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400"
      >
        {#if isLoading}
          <h1>....</h1>
        {:else}
          <button on:click={sendMessage}>Enter</button>
        {/if}
      </kbd>
    </div>
    <div
      aria-hidden="true"
      class="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
    />
  </div>
</div>

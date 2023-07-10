<script lang="ts">
  import { cn } from "$lib/validators/utils";
  import { onMount } from "svelte";
  import { messages } from "$lib/stores/messages";
  import MarkdownLite from "./MarkdownLite.svelte";
  import type { Message } from "$lib/types/message";

  export let className: string = "";

  let message: Message[] = [];
  let inverseMessages: Message[] = [];

  onMount(() => {
    message = $messages;

    inverseMessages = [...message].reverse();
  });
  $: {
    message = $messages;
    inverseMessages = [...message].reverse();
  }
</script>

<div class={cn("flex flex-col gap-3 overflow-y-auto", className)}>
  <div
    class="flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
  >
    <div
      class="order-1 w-full text-center text-indigo-900 font-bold md:font-semibold mb-4"
    >
      Wano Book Assistant
      <div
        class="flex justify-center items-center h-full w-full border-b border-gray-300"
      >
        <div
          class=" bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center"
        >
          <svg
            fill="#000000"
            width="30px"
            height="30px"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style>
                .cls-1 {
                  fill: none;
                }
              </style>
            </defs>
            <rect x="18" y="10" width="2" height="2" />
            <rect x="12" y="10" width="2" height="2" />
            <path
              d="M26,20H21V18h1a2.0023,2.0023,0,0,0,2-2V12h2V10H24V8a2.0023,2.0023,0,0,0-2-2H20V2H18V6H14V2H12V6H10A2.0023,2.0023,0,0,0,8,8v2H6v2H8v4a2.0023,2.0023,0,0,0,2,2h1v2H6a2.0023,2.0023,0,0,0-2,2v8H6V22H26v8h2V22A2.0023,2.0023,0,0,0,26,20ZM10,8H22v8H10Zm3,10h6v2H13Z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="flex-1 flex-grow" />
    {#each inverseMessages as message (message.id)}
      <div class="chat-message">
        <div
          class={cn("flex items-end", {
            "justify-end": message.isUserMessage,
          })}
        >
          <div
            class={cn(
              "flex flex-col space-y-1 text-sm max-w-xs mx-2 overflow-x-hidden",
              {
                "order-1 items-end": message.isUserMessage,
                "order-2 items-start": !message.isUserMessage,
              }
            )}
          >
            <span class="text-[11px] opacity-80"
              >{message.isUserMessage ? "You" : "Bot"}</span
            >
            <p
              class={cn("px-4 py-2 rounded-lg", {
                "bg-blue-600 text-white": message.isUserMessage,
                "bg-gray-200 text-gray-900": !message.isUserMessage,
              })}
            >
              <MarkdownLite text={message.text} />
            </p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<script>
  import { isChatOpen } from "$lib/stores/messages";
  import ChatInput from "./ChatInput.svelte";
  import ChatMessages from "./ChatMessages.svelte";
</script>

<div
  class="absolute md:right-4 bottom-4 md:bottom-2 flex flex-col justify-end items-center md:items-end md:justify-end h-full w-full"
>
  <div class="w-full mr-12 mb-2 md:mr-0">
    <div
      class="flex w-full justify-end cursor-pointer"
      on:click={() => isChatOpen.update((prev) => !prev)}
      on:keydown={(e) => {
        if (e.key === "Escape") {
          isChatOpen.update((prev) => !prev);
        }
      }}
    >
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 5L4.99998 19M5.00001 5L19 19"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
  <div class="flex flex-col h-[350px] w-[300px] bg-[#CBE4DE] rounded-xl">
    <ChatMessages className="px-2 py-3 flex-1" />
    <ChatInput className="px-4 mb-1" />
  </div>
</div>

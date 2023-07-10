<script>
  import { isChatOpen } from "$lib/stores/messages";
</script>

<div
  on:click={() => isChatOpen.update((prev) => !prev)}
  on:keydown={(e) => {}}
  class="md:hidden fixed right-4 w-16 bottom-12 bg-gray-300 border border-gray-200 rounded-full overflow-hidden p-4"
>
  <img src="./AvatarBot.svg" alt="avatar" />
</div>
<div
  on:click={() => isChatOpen.update((prev) => !prev)}
  on:keydown={(e) => {}}
  class="hidden md:block fixed right-8 w-80 bottom-8 bg-white border border-gray-200 rounded-md overflow-hidden p-4"
>
  <div class="w-full f-full flex flex-col">
    <div class="w-full flex gap-3 justify-start items-center text-zinc-800">
      <div class="flex flex-col items-start text-sm">
        <p class="text-xs">Chat with</p>
        <div class="flex gap-1.5 items-center">
          <p class="w-2 h-2 rounded-full bg-green-500" />
          <p class="font-medium">Booksbuddy Support</p>
        </div>
      </div>
    </div>
  </div>
</div>

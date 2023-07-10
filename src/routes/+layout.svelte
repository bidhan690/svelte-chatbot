<script>
  import { isChatOpen } from "$lib/stores/messages";
  import "../app.css";
  import ChatBot from "../components/chatbot/ChatBot.svelte";
  import ChatSkeleton from "../components/chatbot/ChatSkeleton.svelte";
</script>

{#if $isChatOpen}
  <ChatBot />
{:else}
  <ChatSkeleton />
{/if}

<slot />

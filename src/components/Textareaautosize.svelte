<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  export let value: string = "";
  let textarea: HTMLTextAreaElement;
  let textareaRef: HTMLTextAreaElement;

  afterUpdate(() => {
    const focus = setTimeout(() => {
      textareaRef.focus();
    }, 10000);
    return () => clearTimeout(focus);
  });

  onMount(() => {
    textarea = window.document.getElementById(
      "textarea-resize"
    ) as HTMLTextAreaElement;
    textarea.style.cssText = `height: ${textarea.scrollHeight}px; overflow-y: hidden;}`;
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
</script>

<textarea
  on:keydown
  bind:value
  bind:this={textareaRef}
  {...$$props}
  id="textarea-resize"
/>

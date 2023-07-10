<script lang="ts">
  import { afterUpdate, onMount } from "svelte";

  export let text: string;

  interface LinkPart {
    linkText: string;
    linkUrl: string;
  }

  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  let parts: (string | LinkPart)[] = [];

  let lastIndex = 0;
  let match;

  onMount(() => {
    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, linkText, linkUrl] = match;
      const matchStart = match.index;
      const matchEnd = matchStart + fullMatch.length;

      if (lastIndex < matchStart) {
        parts.push(text.slice(lastIndex, matchStart));
      }

      parts.push({
        linkText,
        linkUrl,
      });

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
  });

  afterUpdate(() => {
    parts = [];
    lastIndex = 0;

    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, linkText, linkUrl] = match;
      const matchStart = match.index;
      const matchEnd = matchStart + fullMatch.length;

      if (lastIndex < matchStart) {
        parts.push(text.slice(lastIndex, matchStart));
      }

      parts.push({
        linkText,
        linkUrl,
      });

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
  });
</script>

<main>
  {#each parts as part, i}
    {#if typeof part === "string"}
      {part}
    {:else}
      <a
        target="_blank"
        rel="noopener noreferrer"
        class="break-words underline underline-offset-2 text-blue-600"
        href={part.linkUrl}
      >
        {part.linkText}
      </a>
    {/if}
  {/each}
</main>

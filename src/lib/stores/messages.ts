import type { Message } from "$lib/types/message";
import { nanoid } from "nanoid";
import { writable, type Writable } from "svelte/store";

export const messages: Writable<Message[]> = writable([
  {
    id: nanoid(),
    isUserMessage: false,
    text: "Hello welcome to Wano Book. How can i help you?",
  },
]);

export const isChatOpen = writable(false);

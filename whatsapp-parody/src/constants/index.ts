import { Message } from "../types";

export const COLORS = {
  bg: "#111b21",
  bgSub: "#202c33",
  bgChat: "#0b141a",
  bgBubbleSent: "#005c4b",
  bgBubbleReceived: "#202c33",
  text: "#e9edef",
  textMuted: "#8696a0",
  primary: "#00a884",
  secondary: "#53bdeb",
  border: "#2a3942",
};

export const CHAT_SCRIPT: Message[] = [
  { id: "1", sender: "me", content: "Bro take a deep breath, and consider 😊", time: "1:01 PM" },
  { id: "2", sender: "me", content: "Building dashboards has never been easier.\nI literally just did it in 3 minutes. 😅", time: "1:01 PM" },
  { id: "3", sender: "me", content: "", time: "1:02 PM", isDashboard: true },
  { id: "4", sender: "them", content: "I am saying there was first: the abacus, then the calculator, the Excel sheet, the Google Sheet... and now the Hello World button. 😂", time: "1:03 PM", reaction: "💀" },
  { id: "5", sender: "me", content: "Bro that button took me 6 hours. Respect it. 🙏", time: "1:03 PM" },
  { id: "6", sender: "them", content: "Teach the basics, yes… but Chief,\nthe 777 cockpit is waiting for you. ✈️\n(Step away from the Hello World.)", time: "1:03 PM" },
  { id: "7", sender: "me", content: "😭😭😭 I'll try React next week I promise", time: "1:04 PM" },
  { id: "8", sender: "them", content: "Next week?? That's what you said about LAST week's button. 🫡", time: "1:04 PM" },
];

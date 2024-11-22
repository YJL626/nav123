import { useLocalStorage } from "@vueuse/core";

// Reactive and persisted navLinks using localStorage
export const navLinks = useLocalStorage(
  "navLinks",
  [
    {
      url: "https://twitter.com",
      image: "https://abs.twimg.com/favicons/twitter.ico",
      label: "Twitter",
    },
    {
      url: "https://youtube.com",
      image: "https://www.youtube.com/favicon.ico",
      label: "Youtube",
    },
    {
      url: "https://chatgpt.com/?q=latest+news&hints=search&ref=ext",
      image: "https://chat.openai.com/favicon.ico",
      label: "ChatGPT News",
    },
    {
      url: "https://linkedin.com",
      image: "https://www.linkedin.com/favicon.ico",
      label: "LinkedIn",
    },
    {
      url: "https://github.com",
      image: "https://github.com/favicon.ico",
      label: "GitHub",
    },
    {
      url: "https://reddit.com",
      image: "https://www.reddit.com/favicon.ico",
      label: "Reddit",
    },
    {
      url: "https://news.ycombinator.com",
      image: "https://news.ycombinator.com/favicon.ico",
      label: "Hacker News",
    },
    {
      url: "https://medium.com",
      word: "Medium",
      label: "Medium",
    },
    {
      url: "https://restofworld.org/",
      word: "Rest World",
      label: "Rest of World",
    },
  ],
  {
    initOnMounted: true,
  }
);
if (import.meta.client) {
  if (localStorage.getItem(`navLinks`)) {
    navLinks.value = JSON.parse(localStorage.getItem(`navLinks`) || "") || {};
  }
}

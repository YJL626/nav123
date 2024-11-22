export const searchEngineUrls = {
  google: {
    name: "Google",
    type: "normal",
    search: "https://www.google.com/search?q=%s",
    image: "https://www.google.com/search?q=%s&tbm=isch",
  },
  bing: {
    name: "Bing", 
    type: "normal",
    search: "https://www.bing.com/search?q=%s",
    image: "https://www.bing.com/images/search?q=%s",
  },
  chatgpt: {
    name: "ChatGPT",
    type: "ai",
    search: "https://chatgpt.com/?q=%s&hints=search&ref=ext",
  },
  "grammar fixer": {
    name: "Grammar Fixer",
    type: "agent",
    search: "https://chatgpt.com/?q=fix grammar error ```content %s```",
  },
  "sentence explainer": {
    name: "Sentence Explainer", 
    type: "agent",
    search: "https://chatgpt.com/?q=Next, explain the English sentence's sentence structure, grammar, and vocabulary/phrases in depth. The response should be in simplified Chinese, using plain text to directly explain all content. The English output and sentence structure sections should include IPA phonetic symbols.```sentence %s```&model=o1-mini",
  },
  perplexity: {
    name: "Perplexity AI",
    type: "ai",
    search: "https://www.perplexity.ai/?q=%s",
  },
  doubao: {
    name: "秘塔AI",
    area: "cn",
    type: "ai", 
    search: "https://metaso.cn/?q=%s",
  },
} as const;

export const getSearchUrl = (query: string, engineKey: string): string => {
  const encodedQuery = encodeURIComponent(query);

  const engine = engineKey.toLowerCase();

  const engineConfig =
    searchEngineUrls[engine as keyof typeof searchEngineUrls];

  if (engineConfig) {
    return engineConfig.search.replace("%s", encodedQuery);
  } else {
    // Default to Google search if engine or type is not found
    const defaultUrlPattern = searchEngineUrls["google"]["search"];
    return defaultUrlPattern.replace("%s", encodedQuery);
  }
};

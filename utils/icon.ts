export const getFavicon = (url: string) => {
  const domain = new URL(url).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=60`;
  return faviconUrl;
};

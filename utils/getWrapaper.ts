import { useLocalStorage } from "@vueuse/core";
export const BG_ID_KEY = "bgId";

export const getBingWallpaper = async (idx = 0) => {
  try {

    const response = await fetch(
      `https://bingw.jasonzeng.dev/?resolution=UHD&index=${idx}&format=json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Construct the full image URL
    return data;
  } catch (error) {
    console.error("Failed to fetch wallpaper:", error);
    // Fallback to local backgrounds if fetch fails
    return {
      title: "Soil, Sea, and Sky",
      copyright:
        "Wadden Sea coast, near Modegade, Friesland, Netherlands (© Ron ter Burg/Minden Pictures)",
      date: "20241115",
      url: "https://www.bing.com/th?id=OHR.FrieslandNetherlands_ZH-CN5952456898_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp",
    };
  }
};

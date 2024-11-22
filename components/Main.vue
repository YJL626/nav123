<script setup lang="ts">
import { onMounted, ref, computed, onBeforeMount, toRef } from "vue";
import NavLinks from "./NavLinks.vue";
import { BG_ID_KEY, getBingWallpaper } from "../utils/getWrapaper";
import { useHead } from '#imports';

// Import getSearchUrl function
import { getSearchUrl, searchEngineUrls } from "../utils/getSearchUrl"; // Adjust the path as necessary
import { useLocalStorage } from "@vueuse/core";
import { navLinks } from "../data/navLinks";
import { getLatestBingWallpaper } from "../server/getLatestBingWallpaper";
// Extracted constant for the background ID key
const t = "Nav123"
useHead({
      title: `${t} - Your Navigation Website`,
      meta: [
        { name: 'description', content: `Explore curated links and resources for ${t}.` },
        { property: 'og:title', content: `${t} - Your Navigation Website` },
        { property: 'og:description', content: `Curated resources and links for ${t}.` },
      ],
    });
const dateKey = ~~(Date.now() / 1000 / 60 / 60 / 24);
const localBgKey = useCookie("localBgKey", {
  default: () => ({ date: dateKey, index: 0 }),
});

console.log(localBgKey.value);
const {
  data: localBg,
  error,
  refresh,
} = await useAsyncData(
  "" + localBgKey.value.date + localBgKey.value.index,
  () => getLatestBingWallpaper(localBgKey.value.index + "")
);
const bgInfo = ref(localBg.value);
// Function to preload the image
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    console.log(img.src);
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

// Function to fetch and preload the wallpaper
const fetchBackground = async () => {
  try {
    const idx = ~~(Math.random() * 600);
    const bgInfo1 = await getBingWallpaper(idx);
    console.log(bgInfo1, "bginfo");
    if (bgInfo) {
      await preloadImage(bgInfo1.url);
      bgInfo.value = bgInfo1;
      localBgKey.value.index = idx;
      console.log("update");
    }
  } catch (error) {
    console.error("Failed to load the background image:", error);
  }
};

// Fetch and preload the wallpaper on mount

// Update the computed property to use the fallback gradient
const backgroundStyle = computed(() => {
  return bgInfo.value?.url ? `url("${bgInfo.value.url}")` : "none";
});

// Method to refresh the background when the button is clicked
const refreshBackground = () => {
  fetchBackground();
};

// Reactive variables for search
const query = ref("");
const selectedEngine = useLocalStorage("selectedEngine", "chatgpt"); // default search engine

// Handle search action
const performSearch = () => {
  if (query.value.trim() !== "") {
    console.log(query.value, selectedEngine.value);
    const url = getSearchUrl(query.value, selectedEngine.value);
    console.log(url);
    window.open(url, "_blank");
  }
};
const aiSearchEngines = computed(() => {
  return Object.entries(searchEngineUrls).filter((i) => i[1].type === "ai");
});
const searchEngines = computed(() => {
  return Object.entries(searchEngineUrls).filter((i) => i[1].type === "normal");
});
const agentSearchEngines = computed(() => {
  return Object.entries(searchEngineUrls).filter((i) => i[1].type === "agent");
});

// Reactive variable to control settings dialog visibility
const settingsOpen = ref(false);

// Method to handle settings button click
const openSettings = () => {
  settingsOpen.value = true;
};

// Method to close settings dialog
const closeSettings = () => {
  settingsOpen.value = false;
};

// Methods to reorder navLinks
const moveLinkUp = (index: number) => {
  if (index > 0) {
    const links = [...navLinks.value];
    [links[index - 1], links[index]] = [links[index], links[index - 1]];
    navLinks.value = links;
  }
};

const moveLinkDown = (index: number) => {
  if (index < navLinks.value.length - 1) {
    const links = [...navLinks.value];
    [links[index], links[index + 1]] = [links[index + 1], links[index]];
    navLinks.value = links;
  }
};

// Method to remove a navLink
const removeLink = (index: number) => {
  const links = [...navLinks.value];
  links.splice(index, 1);
  navLinks.value = links;
};

// Add these refs for edit dialog
const editDialogOpen = ref(false);
const editingLink = ref<{
  index: number;
  label: string;
  url: string;
  image: string;
} | null>(null);

// Update the editLink method
const editLink = (index: number) => {
  const link = navLinks.value[index];
  editingLink.value = {
    index,
    label: link.label,
    url: link.url,
    image: link.image || "",
  };
  editDialogOpen.value = true;
};

// Add this method to save edits
const saveEdit = () => {
  if (editingLink.value) {
    const { index, label, url, image } = editingLink.value;
    const links = [...navLinks.value];
    links[index] = { ...links[index], label, url, image };
    navLinks.value = links;
    editDialogOpen.value = false;
    editingLink.value = null;
  }
};
const defaultIconText = `Get Default`;
const iconText = ref(`Get Default`);
const setDefaultIcon = () => {
  try {
    editingLink.value.image = getFavicon(editingLink.value.url);
  } catch (error) {
    iconText.value = `Please enter a valid URL`;
    setTimeout(() => {
      iconText.value = defaultIconText;
    }, 3000);
  }
};
</script>

<template>
  <div class="app-container" :style="{ backgroundImage: backgroundStyle }">
    <h1 class="main-title">
      {{ bgInfo?.title }}
    </h1>
    <form @submit.prevent="performSearch" class="search-form">
      <input
        v-model="query"
        type="text"
        placeholder="Search..."
        class="search-input"
      />
      <select v-model="selectedEngine" class="search-select">
        <optgroup label="AI Search">
          <option
            v-for="[key, engine] in aiSearchEngines"
            :key="key"
            :value="key"
          >
            {{ engine.name }}
          </option>
        </optgroup>
        <optgroup label="Agent">
          <option
            v-for="[key, engine] in agentSearchEngines"
            :key="key"
            :value="key"
          >
            {{ engine.name }}
          </option>
        </optgroup>
        <optgroup label="Search">
          <option
            v-for="[key, engine] in searchEngines"
            :key="key"
            :value="key"
          >
            {{ engine.name }}
          </option>
        </optgroup>
      </select>
      <button type="submit" class="search-button">Search</button>
    </form>
    <!-- Pass navLinks to NavLinks component -->
    <NavLinks :navLinks="navLinks" />
    <!-- Settings and Refresh Buttons Container -->
    <div class="control-buttons">
      <button
        class="settings-button"
        @click="openSettings"
        aria-label="Open Settings"
      >
        ⚙️
      </button>
      <button
        class="refresh-button"
        @click="refreshBackground"
        aria-label="Refresh Background"
      >
        &#x21bb;
      </button>
    </div>

    <!-- Settings Dialog -->
    <div v-if="settingsOpen" class="settings-dialog">
      <div class="settings-dialog-content">
        <h2>Settings</h2>
        <!-- Reorder and Remove navLinks -->
        <ul class="nav-links-list">
          <li v-for="(link, index) in navLinks" :key="index">
            <span>{{ link.label }}</span>
            <div class="reorder-buttons">
              <button @click="moveLinkUp(index)" :disabled="index === 0">
                ↑
              </button>
              <button
                @click="moveLinkDown(index)"
                :disabled="index === navLinks.length - 1"
              >
                ↓
              </button>
              <button @click="editLink(index)">✎</button>
              <button @click="removeLink(index)">✖</button>
            </div>
          </li>
        </ul>
        <button @click="closeSettings" class="close-button">Close</button>
      </div>
    </div>

    <!-- Edit Dialog -->
    <div v-if="editDialogOpen" class="edit-dialog">
      <div class="edit-dialog-content">
        <h3>Edit Link</h3>
        <div class="edit-form">
          <div class="form-group">
            <label>Label:</label>
            <input v-model="editingLink.label" type="text" class="edit-input" />
          </div>
          <div class="form-group">
            <label>URL:</label>
            <input v-model="editingLink.url" type="text" class="edit-input" />
          </div>
          <div class="form-group">
            <label>Image URL:</label>
            <div
              style="
                display: grid;
                grid-template-columns: 1fr 7rem;
                gap: 0.2rem;
              "
            >
              <input
                v-model="editingLink.image"
                type="text"
                class="edit-input"
              />
              <button
                type="button"
                class="get-default-button"
                @click="setDefaultIcon"
              >
                <span class="icon">🎨</span>
                <span class="text">{{ iconText }}</span>
              </button>
            </div>
          </div>
          <div class="edit-buttons">
            <button @click="saveEdit" class="save-button">Save</button>
            <button @click="editDialogOpen = false" class="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* Removed incorrect background-image binding */
  transition: background-image 0.5s ease-in-out;
  position: relative; /* Ensure that the button is positioned relative to this container */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Main Title Styling */
.main-title {
  font-size: 2rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 20px;
  text-align: center;
  animation: fadeInDown 1s;
}

/* Animation for the title */
@keyframes fadeInDown {
  from {
    /* transform: translateY(-10px); */
  }
  to {
    transform: translateY(0);
  }
}

/* Search Form */
.search-form {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  font-size: 1rem;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-select {
  margin-left: 10px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #2980b9;
}

/* Control Buttons Container */
.control-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  gap: 10px;
}

/* Common button styles */
.refresh-button {
  margin-top: 1rem;
}
.refresh-button,
.settings-button {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, color 0.3s;
}

.refresh-button:hover,
.settings-button:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #000;
}

.refresh-button:focus,
.settings-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3498db;
}

/* Settings Dialog Styles */
.settings-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-dialog-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  max-height: 80%;
  overflow-y: auto;
}

.settings-dialog-content h2 {
  margin-top: 0;
  text-align: center;
}

.nav-links-list {
  list-style: none;
  padding: 0;
}

.nav-links-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.nav-links-list li span {
  flex-grow: 1;
}
.reorder-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.reorder-buttons button {
  width: 2rem;
  height: 2rem;
  margin-left: 5px;
  font-size: 1rem;
}

.close-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.edit-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-dialog-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 400px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.edit-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.edit-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #3498db;
  color: white;
}

.cancel-button {
  background-color: #95a5a6;
  color: white;
}

.save-button:hover {
  background-color: #2980b9;
}

.cancel-button:hover {
  background-color: #7f8c8d;
}
</style>

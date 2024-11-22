<template>
  <div class="social-links">
    <NavItem v-for="item in navLinks" :key="item.url" :item="item" />
    <div class="add-button-container">
      <div class="add-button" @click="handleAdd">+</div>
    </div>
  </div>

  <!-- Add New Navigation Item Dialog -->
  <div v-if="isAddDialogOpen" class="dialog-overlay">
    <div class="dialog-content">
      <button class="close-button" @click="cancelAdd">&times;</button>
      <h2>Add New Navigation Item</h2>
      <form @submit.prevent="addNavItem" class="add-form">
        <div class="form-group">
          <input v-model="newNavItem.label" required />
          <label>Label</label>
        </div>
        <div class="form-group">
          <input v-model="newNavItem.url" required />
          <label>URL</label>
        </div>
        <div class="form-group" style="display: flex; align-items: center">
          <input v-model="newNavItem.image" />
          <label>Image URL (optional)</label>
          <button
            type="button"
            class="get-default-button"
            @click="setDefaultIcon"
          >
            <span class="icon">🎨</span>
            <span class="text">{{ iconText }}</span>
          </button>
        </div>
        <!-- <button
          type="button"
          class="get-default-button"
          @click="newNavItem.image = getFavicon(newNavItem.value?.url)"
          :disabled="!newNavItem.url"
        >
          <span class="icon">🎨</span>
          <span class="text">Get Default</span>
        </button> -->
        <div class="form-actions">
          <button type="submit" class="btn-submit">Add</button>
          <button type="button" @click="cancelAdd" class="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavItem from "./NavItem.vue";
import { useLocalStorage } from "@vueuse/core";
import { navLinks } from "../data/navLinks";

const itemSize = ref("66px");
const isAddDialogOpen = ref(false);
const newNavItem = ref({
  url: "",
  image: "",
  label: "",
});
const useDefaultIcon = ref(false);

function handleAdd() {
  isAddDialogOpen.value = true;
}

function addNavItem() {
  if (useDefaultIcon.value) {
    newNavItem.value.image = getFavicon(newNavItem.value.url) || ""; // Clear the image URL when using default icon
  }
  navLinks.value.push({ ...newNavItem.value });
  newNavItem.value = { url: "", image: "", label: "" };
  isAddDialogOpen.value = false;
}

function cancelAdd() {
  newNavItem.value = { url: "", image: "", label: "" };
  isAddDialogOpen.value = false;
}
const defaultIconText = `Get Default`;
const iconText = ref(`Get Default`);
const setDefaultIcon = () => {
  try {
    newNavItem.value.image = getFavicon(newNavItem.value.url);
  } catch (error) {
    iconText.value = `Please enter a valid URL`;
    setTimeout(() => {
      iconText.value = defaultIconText;
    }, 3000);
  }
};
</script>

<style scoped>
.social-links {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2rem 1rem;
}

.add-button {
  opacity: 0;
  cursor: pointer;
  width: v-bind(itemSize);
  height: v-bind(itemSize);
  border: 2px dashed #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #666;
  transition: opacity 0.3s ease;
}

.add-button-container:hover .add-button {
  opacity: 1;
}

.add-button:hover {
  border-color: #333;
  color: #333;
}

/* Dialog Styles */
.dialog-overlay {
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

.dialog-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  position: relative;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dialog-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.add-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-group input {
  width: 100%;
  padding: 1rem 0.5rem 0.5rem;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  font-size: 16px;
}

.form-group input:focus {
  border-bottom-color: #007bff;
}

.form-group label {
  position: absolute;
  top: 1rem;
  left: 0.5rem;
  font-size: 16px;
  color: #aaa;
  transition: all 0.2s ease;
}

.form-group input:focus + label,
.form-group input:not(:placeholder-shown) + label {
  top: -0.5rem;
  font-size: 12px;
  color: #007bff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-submit {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  margin-right: 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.btn-cancel {
  background-color: transparent;
  color: #555;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #f0f0f0;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.checkbox-group label {
  position: static;
  color: #333;
  font-size: 14px;
}

.get-default-button {
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.get-default-button:hover:not(:disabled) {
  background-color: #e4e4e4;
}

.get-default-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.get-default-button .icon {
  font-size: 1.1em;
}

.get-default-button .text {
  font-size: 0.9em;
}
</style>

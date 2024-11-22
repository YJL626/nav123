<template>
  <a
    :key="item.url"
    :href="item.url"
    target="_blank"
    rel="noopener noreferrer"
    style="
      color: white;
      text-decoration: none;
      display: grid;
      justify-items: center;
    "
  >
    <img
      v-if="item.image"
      :src="item.image"
      :alt="item.label"
      class="social-icon"
    />
    <span v-else-if="item.word" class="word-icon">{{ item.word }}</span>
    <span v-else class="word-icon">{{ item.label }}</span>
    <span v-if="item.letter" class="letter">{{ item.letter }}</span>
    <span class="label">{{ item.label }}</span>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    url: string;
    image?: string;
    word?: string;
    letter?: string;
    label: string;
  };
  iconSize?: string;
}>();
</script>

<style scoped>
.social-icon {
  width: v-bind('iconSize || "66px"');
  height: v-bind('iconSize || "66px"');
  border-radius: 50%;
  object-fit: fill;
}

.word-icon {
  width: v-bind('iconSize || "80px"');
  height: v-bind('iconSize || "80px"');
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  font-size: 1em;
  color: white;
  text-transform: uppercase;
  text-align: center;
}

.letter,
.label {
  color: white;
}

/* Ensures that the content is also vertically centered */
a {
  display: grid;
  justify-items: center;
  align-items: center; /* Centers items vertically */
  gap: 8px; /* Adds space between items */
}
</style>

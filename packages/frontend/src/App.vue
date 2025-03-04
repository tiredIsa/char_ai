<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useAppStore } from './stores/app'
import { onBeforeMount } from 'vue';

const app = useAppStore()

import { onMounted } from 'vue';
import { watch } from 'vue';

onBeforeMount(async () => {
  app.isTauri = '__TAURI_INTERNALS__' in window
  app.isMobile = navigator.maxTouchPoints > 0
})
onMounted(() => {
  //idk work it or not xd
  window.addEventListener('resize', () => {
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      document.body.style.height = `${visualViewport.height}px`;
    }
  });
})

const viewport = window.visualViewport;

// Отслеживание изменений размера видимой области
viewport?.addEventListener('resize', () => {
  document.body.style.height = `${viewport.height}px`;
});

watch(() => viewport?.height, () => {
  document.body.style.height = `${viewport?.height || window.innerHeight}px`;
}, { immediate: true })

</script>
<template>
  <main class="h-full">
    <RouterView />
  </main>
</template>
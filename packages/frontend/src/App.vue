<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/app'
import { onBeforeMount } from 'vue';

const SideBar = defineAsyncComponent(() => import('./components/SideBar.vue'))

const app = useAppStore()

import { watch } from 'vue';
import { defineAsyncComponent } from 'vue';

onBeforeMount(async () => {
  app.isTauri = '__TAURI_INTERNALS__' in window
  app.isMobile = navigator.maxTouchPoints > 0
})

// Отслеживание изменений размера видимой области
window.visualViewport?.addEventListener('resize', () => {
  document.body.style.height = `${window.visualViewport?.height || window.innerHeight}px`;
});

watch(() => window.visualViewport?.height, () => {
  document.body.style.height = `${window.visualViewport?.height || window.innerHeight}px`;
}, { immediate: true })
</script>

<template>
  <main class="h-full">
    <SideBar v-if="!app.isMobile" />
    <RouterView />
  </main>
</template>
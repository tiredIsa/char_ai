<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useAppStore } from './stores/app'
import { onBeforeMount } from 'vue';

const app = useAppStore()

import { onMounted } from 'vue';
import { ref } from 'vue';
let invoke: any;


if (app.isTauri) {
  import('@tauri-apps/api/core').then((module) => {
    invoke = module.invoke
  });

}

onBeforeMount(async () => {
  app.isTauri = '__TAURI_INTERNALS__' in window
  app.isMobile = navigator.maxTouchPoints > 0
})

const safeAreaStyles = ref({});
async function requestInsets() {
  if (!invoke) return
  try {
    const insets = await invoke('get_safe_area_insets') as { top: number; right: number; bottom: number; left: number };
    if (!insets) return
    safeAreaStyles.value = insets;
    const root = document.documentElement; // Получаем корневой элемент (<html>)
    root.style.setProperty('--safe-area-inset-top', `${insets.top * 1.5}px`);
    root.style.setProperty('--safe-area-inset-right', `${insets.right}px`);
    root.style.setProperty('--safe-area-inset-bottom', `${insets.bottom}px`);
    root.style.setProperty('--safe-area-inset-left', `${insets.left}px`);
  } catch (error) {
    console.error("Error fetching insets:", error);
  }
}

onMounted(() => {
  requestInsets();
})


import '@material/web/button/filled-tonal-button.js';

</script>

<template>
  <main>
    <RouterView />
  </main>
</template>
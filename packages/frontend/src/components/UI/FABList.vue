<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'


defineProps<{
    buttonsArray: Array<{ title: string; icon: string; function: () => void }>
}>()
const sheet = ref<HTMLDivElement | null>(null)

const isOpen = ref(false)

const openSheet = () => {
    isOpen.value = !isOpen.value
}

onClickOutside(sheet, event => isOpen.value = false)

</script>

<template>
    <Transition name="list">
        <div v-if="isOpen" class="absolute z-10 w-full h-full bg-black opacity-50"></div>
    </Transition>
    <div ref="sheet" class="fixed bottom-20 z-11 right-4 flex flex-col items-end gap-5">
        <TransitionGroup name="list" tag="div" class="flex flex-col gap-3 items-end">
            <div v-if="isOpen" v-for="(item, index) in buttonsArray" v-ripple="{ color: 'rgba(0, 0, 0, 0.3)' }"
                class="bg-white sheet-element-animation font-semibold gap-3 text-black flex flex-row justify-start rounded-3xl p-3 px-5"
                :style="{ transitionDelay: `${index * 30}ms` }" @click="item.function">
                {{ item.title }}
                <img :src="`/icons/${item.icon}.svg`" alt="" class="h-6">
            </div>
        </TransitionGroup>
        <button @click="openSheet" class="bg-zinc-200 w-15 h-15  rounded-2xl "
            v-ripple="{ color: 'rgba(0, 0, 0, 0.1)' }">
            <svg class="p-4 duration-300 transition-all rotate-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                :class="{ 'rotate-45': isOpen }">
                <path fill="#000"
                    d="M12 21q-.425 0-.712-.288T11 20v-7H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7V4q0-.425.288-.712T12 3t.713.288T13 4v7h7q.425 0 .713.288T21 12t-.288.713T20 13h-7v7q0 .425-.288.713T12 21" />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}
</style>
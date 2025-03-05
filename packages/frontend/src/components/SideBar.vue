<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const redirectTelegram = () => {
    window.open('https://t.me/isaaafxck', '_blank')
}

const openTestChat = () => {
    router.push({ name: 'chat' })
}

const isOpen = ref(true)

const toggleSideBar = () => {
    isOpen.value = !isOpen.value
}

const openHomePage = () => {
    router.push({ name: 'home' })
}

</script>


<template>
    <button v-if="!isOpen" @click="toggleSideBar"
        class="fixed  top-0 left-0 mt-8 ml-3 cursor-pointer opacity-50 hover:opacity-100 duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8" viewBox="0 0 24 24">
            <path fill="#fff"
                d="M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zm0 2H9v14h9a1 1 0 0 0 .993-.883L19 18V6a1 1 0 0 0-.883-.993zm-4.387 4.21l.094.083l2 2a1 1 0 0 1 .083 1.32l-.083.094l-2 2a1 1 0 0 1-1.497-1.32l.083-.094L13.585 12l-1.292-1.293a1 1 0 0 1-.083-1.32l.083-.094a1 1 0 0 1 1.32-.083" />
        </svg>
    </button>
    <div class="w-65 fixed h-full bg-zinc-900 flex flex-col p-6 duration-200"
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
        <div class="flex flex-col gap-3 border-b border-zinc-800 pb-5">
            <div class="flex items-center">
                <h1 class="text-white text-2xl font-bold">Char.Fxck</h1>
                <button @click="toggleSideBar"
                    class="mt-1 ml-auto opacity-50 duration-200 cursor-pointer hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#fff"
                            d="M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zm0 2H9v14h9a1 1 0 0 0 .993-.883L19 18V6a1 1 0 0 0-.883-.993zm-2.293 4.293a1 1 0 0 1 .083 1.32l-.083.094L14.415 12l1.292 1.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083l-2-2a1 1 0 0 1-.083-1.32l.083-.094l2-2a1 1 0 0 1 1.414 0" />
                    </svg>
                </button>
            </div>
            <button
                class="text-white mt-5 text-sm justify-center gap-5 border border-zinc-700 flex items-center w-full font-semibold p-2 py-3 rounded-full bg-zinc-800 cursor-pointer duration-200 hover:bg-zinc-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#fff"
                        d="M12 21q-.425 0-.712-.288T11 20v-7H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7V4q0-.425.288-.712T12 3t.713.288T13 4v7h7q.425 0 .713.288T21 12t-.288.713T20 13h-7v7q0 .425-.288.713T12 21" />
                </svg>
                <p>Создать</p>
            </button>
            <button @click="openHomePage" :class="{ 'bg-zinc-800': route.path === '/' }"
                class="text-white px-4 text-sm gap-2 w-full h-12 rounded-2xl items-center flex justify-start cursor-pointer hover:bg-zinc-800 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#fff"
                        d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19" />
                </svg>
                <p class="text-base">Главная</p>
            </button>
        </div>
        <div class="grow py-4 gap-2 flex flex-col">
            <div @click="openTestChat"
                class="flex h-12 items-center gap-3 hover:bg-zinc-800 cursor-pointer rounded-xl px-2">
                <img src="https://i.pinimg.com/736x/6d/37/e5/6d37e5b93a31d0ac06877fb15b811ca5.jpg"
                    class="w-10 h-10 rounded-full" alt="">
                <div class="flex flex-col">
                    <p class="text-white text-sm font-semibold">Yuna</p>
                    <p class="text-zinc-400 text-xs">prod. Isa</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-auto " viewBox="0 0 24 24">
                    <path fill="#888888"
                        d="M6 14q-.825 0-1.412-.587T4 12t.588-1.412T6 10t1.413.588T8 12t-.587 1.413T6 14m6 0q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m6 0q-.825 0-1.412-.587T16 12t.588-1.412T18 10t1.413.588T20 12t-.587 1.413T18 14" />
                </svg>
            </div>

        </div>
        <div class="border-t border-zinc-800">
            <button @click="redirectTelegram"
                class="text-white mt-5 text-sm justify-center gap-5 border border-zinc-700 flex items-center w-full font-semibold p-2 py-3 rounded-full bg-zinc-800 mb-5 cursor-pointer duration-200 hover:bg-zinc-900">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24">
                    <g fill="none" fill-rule="evenodd">
                        <path
                            d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                        <path fill="#fff"
                            d="M19.777 4.43a1.5 1.5 0 0 1 2.062 1.626l-2.268 13.757c-.22 1.327-1.676 2.088-2.893 1.427c-1.018-.553-2.53-1.405-3.89-2.294c-.68-.445-2.763-1.87-2.507-2.884c.22-.867 3.72-4.125 5.72-6.062c.785-.761.427-1.2-.5-.5c-2.302 1.738-5.998 4.381-7.22 5.125c-1.078.656-1.64.768-2.312.656c-1.226-.204-2.363-.52-3.291-.905c-1.254-.52-1.193-2.244-.001-2.746z" />
                    </g>
                </svg>
                Следить за проектом
            </button>
            <div
                class="flex items-center gap-2 text-white duration-200 cursor-pointer hover:bg-zinc-800 p-2 rounded-xl">
                <img src="https://i.pinimg.com/736x/05/76/ef/0576ef0a38afe85732a1cf24971bb99c.jpg"
                    class="w-9 h-9 object-cover rounded-full" alt="">
                <p class="font-semibold text-sm">Name</p>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 р-4 ml-auto" viewBox="0 0 24 24">
                    <path fill="#fff"
                        d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062" />
                </svg>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import FABList from '@/components/UI/FABList.vue';
import router from '@/router';

const selectedPage = ref(0)

const selectPage = (index: number) => {
    selectedPage.value = index
}

const FABButtons = [
    {
        title: 'Создать персонажа',
        icon: 'newCharacter',
        function: () => {
            console.log('test')
        }
    },
    {
        title: 'Создать комнату',
        icon: 'newGroup',
        function: () => {
            console.log('test')
        }
    },

]

const openChat = () => {
    router.push({ name: 'chat' })

}

</script>

<template>
    <FABList :buttons-array="FABButtons"></FABList>

    <div class="fixed bottom-0 w-full h-18 flex justify-between items-center bg-zinc-900 px-8 z-10 text-white">
        <button v-for="i in 3" class="flex flex-col">
            <div @click="selectPage(i - 1)" class="w-15  h-8 relative flex items-center justify-center p-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="object-cover h-full z-2" viewBox="0 0 24 24">
                    <path fill="#fff"
                        d="M2 22V9q0-.825.588-1.413Q3.175 7 4 7h2v5q0 .825.588 1.412Q7.175 14 8 14h10v3q0 .825-.587 1.413Q16.825 19 16 19H5Zm16-8V9q0-.825-.587-1.413Q16.825 7 16 7H6V4q0-.825.588-1.413Q7.175 2 8 2h12q.825 0 1.413.587Q22 3.175 22 4v8q0 .825-.587 1.412Q20.825 14 20 14Zm-6-3.5Zm0 0Z" />
                </svg>
                <div class="bg-zinc-600 z-1 absolute w-1/2 opacity-0 h-full rounded-full duration-150 transition-all"
                    :class="{ 'w-full opacity-100': selectedPage === i - 1, }">
                </div>
            </div>
        </button>
    </div>
    <div class="h-full w-full bg-zinc-950">
        <div class="flex flex-col ">
            <div class="flex h-20 text-white items-center justify-between px-5">
                <h1 class="font-bold text-2xl ">Char.Fxck</h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
                    <path fill="#888888"
                        d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
                </svg>
            </div>
            <div class="flex justify-around px-5 text-base pb-2">
                <div class="flex w-15 flex-col text-white items-center">
                    <span>Чаты</span>
                    <div class="w-full h-1 bg-zinc-300 rounded-t-xl"></div>
                </div>
                <div class="flex w-15 flex-col text-white items-center">
                    <span>Комнаты</span>
                    <!-- <div class="w-full h-1 bg-zinc-300 rounded-t-xl"></div> -->
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <div v-for="i in 1" v-ripple class="w-full px-5 h-20 flex gap-5 p-3 items-center text-white"
                @click="openChat">
                <img src="https://i.pinimg.com/736x/df/96/83/df9683db843ef95df3197312a69902da.jpg"
                    class="w-13 h-13 rounded-full" alt="">
                <div class="flex grow w-full flex-col">
                    <div class="flex justify-between">
                        <p class="truncate max-w-60 font-semibold">
                            Yuna
                        </p>
                        <p class="text-xs">Last</p>

                    </div>
                    <div class="flex justify-between">
                        <p class="text-sm font-light truncate max-w-60 text-zinc-400">Yuna Description</p>
                        <svg xmlns="http://www.w3.org/2000/svg" class="border-2 border-zinc-600 rounded-full p-1"
                            width="1.5rem" height="1.5rem" viewBox="0 0 256 256">
                            <path fill="#888888"
                                d="m238.15 78.54l-60.69-60.68a20 20 0 0 0-28.3 0L97.2 70c-12.43-3.33-36.68-5.72-61.74 14.5a20 20 0 0 0-1.6 29.73l45.46 45.47l-39.8 39.8a12 12 0 0 0 17 17l39.8-39.81l45.47 45.46a20 20 0 0 0 14.12 5.85c.46 0 .93 0 1.4-.05a20 20 0 0 0 14.56-7.95c4.69-6.23 11-16.13 14.44-28s3.45-22.88.16-33.4l51.7-51.87a20 20 0 0 0-.02-28.19m-74.26 68.79a12 12 0 0 0-2.23 13.84c3.43 6.86 6.9 21-6.28 40.65L54.08 100.53c21.09-14.59 39.53-6.64 41-6a11.67 11.67 0 0 0 13.81-2.29l54.43-54.61l55 55Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

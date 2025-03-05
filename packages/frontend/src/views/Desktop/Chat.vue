<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useDummyMessages, type Message } from '../../stores/messages'
import SideBar from '@/components/SideBar.vue';

const newMessage = ref('');
const messages = computed(() => useDummyMessages().markdownMessages);
const messagesContainer = ref<HTMLElement | null>(null);

const aiTyping = ref(false)
const chatError = ref(false)

async function sendMessage() {
  if (!newMessage.value.trim()) return;


  const temp = newMessage.value
  newMessage.value = '';

  aiTyping.value = true;
  const res = await useDummyMessages().sendMessage(temp);


  if (res) {
    aiTyping.value = false
  } else {
    aiTyping.value = false
    chatError.value = true
  }

}

const resendMessgae = async () => {
  chatError.value = false
  aiTyping.value = true
  const res = await useDummyMessages().resendLastMessage()

  if (res) {
    aiTyping.value = false
  } else {
    aiTyping.value = false
    chatError.value = true
  }
}

watch(messages, () => {
  scrollToBottom();
}, { deep: true, immediate: true });

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

</script>

<template>
  <div class="flex flex-col h-dvh bg-zinc-950 items-center w-full">
    <!-- Область сообщений -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950 max-w-2xl w-full " ref="messagesContainer">
      <div class="flex flex-col items-center justify-center mt-20 mb-10">
        <img src="/logo.webp" alt="" class="w-[64px] h-[64px]">
        <h1 class="text-white pb-2 ">char.fxck</h1>
        <span class="text-zinc-400">Юна. Просто Юна, приятно познакомится</span>
        <span class="text-zinc-400">prod. isa</span>
      </div>
      <div v-for="(message, index) in messages" :key="index" :class="message?.role === 'user' ? 'ml-auto' : 'mr-auto'">
        <div class="flex items-start" :class="message?.role === 'user' ? 'flex-row-reverse' : ''">

          <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            :class="message?.role === 'user' ? 'bg-zinc-700 ml-2' : 'bg-white mr-2'">
            <span class="text-xs" :class="message?.role === 'user' ? 'text-white' : 'text-black'">
              {{ message?.role === 'user' ? 'U' : 'AI' }}
            </span>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-zinc-200 text-xs" :class="message?.role === 'user' ? 'text-right pr-2' : ' pl-2'">
              {{ message?.role === 'user' ? 'Пользователь' : useDummyMessages().charName }}
            </div>
            <div
              class="max-w-xs sm:max-w-md md:max-w-lg rounded-2xl px-4 py-2.5 bg-zinc-800 text-zinc-200 rounded bg-zinc-700"
              :class="{ '-ml-3': message?.role !== 'user', '-mr-3': message?.role === 'user' }">
              <p class="w-full break-words overflow-hidden" v-html="message?.parts[0].text"></p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="aiTyping" class='mr-auto'>
        <div class="flex items-start">

          <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-white mr-2">
            <span class="text-xs">
              AI
            </span>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-zinc-200 text-xs pl-2">
              {{ useDummyMessages().charName }}
            </div>
            <div
              class="max-w-xs sm:max-w-md md:max-w-lg rounded-2xl px-4 py-2.5 bg-zinc-800 text-zinc-200 rounded bg-zinc-700 -ml-2">
              <p>
                <svg height="20" width="40" class="loader">
                  <circle class="dot" cx="10" cy="10" r="3" style="fill:grey;" />
                  <circle class="dot" cx="20" cy="10" r="3" style="fill:grey;" />
                  <circle class="dot" cx="30" cy="10" r="3" style="fill:grey;" />
                </svg>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="chatError" class='mr-auto'>
        <div class="flex items-start">

          <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-white mr-2">
            <span class="text-xs">
              AI
            </span>
          </div>
          <div class="flex flex-col gap-2 ">
            <div class="text-zinc-200 text-xs pl-2">
              {{ useDummyMessages().charName }}
            </div>
            <div @click="resendMessgae"
              class="max-w-xs sm:max-w-md md:max-w-lg rounded-2xl px-4 py-2.5 bg-zinc-800 text-zinc-200 rounded bg-zinc-700 cursor-pointer hover:bg-zinc-600 duration-200 -ml-2">
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
                  <path fill="#fff"
                    d="M12.077 19q-2.931 0-4.966-2.033q-2.034-2.034-2.034-4.964t2.034-4.966T12.077 5q1.783 0 3.339.847q1.555.847 2.507 2.365V5.5q0-.213.144-.356T18.424 5t.356.144t.143.356v3.923q0 .343-.232.576t-.576.232h-3.923q-.212 0-.356-.144t-.144-.357t.144-.356t.356-.143h3.2q-.78-1.496-2.197-2.364Q13.78 6 12.077 6q-2.5 0-4.25 1.75T6.077 12t1.75 4.25t4.25 1.75q1.787 0 3.271-.968q1.485-.969 2.202-2.573q.085-.196.274-.275q.19-.08.388-.013q.211.067.28.275t-.015.404q-.833 1.885-2.56 3.017T12.077 19" />
                </svg>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>



    <!-- Форма ввода -->
    <div class="p-4 max-w-2xl w-full ">
      <div class="flex items-center space-x-2">
        <input v-model="newMessage" type="text" placeholder="Напишите сообщение..."
          class="w-full px-4 py-2 rounded-full bg-zinc-800 text-white border border-zinc-700 focus:outline-none "
          @keyup.enter="sendMessage" />
        <button @click="sendMessage"
          class="p-2 rounded-full bg-white text-black hover:bg-zinc-200 transition duration-200 focus:outline-none cursor-pointer hover:scale-105"
          :disabled="!newMessage.trim() || aiTyping" :class="{ 'opacity-50': !newMessage.trim() || aiTyping }">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
            <path fill="#000"
              d="M5.133 18.02q-.406.163-.77-.066T4 17.288v-3.942L9.846 12L4 10.654V6.712q0-.438.364-.666t.77-.067l12.512 5.269q.49.225.49.756q0 .53-.49.748z" />
          </svg>
        </button>
      </div>
      <div class="text-zinc-100 pt-3 text-xs w-full flex flex-row justify-center ">
        <p class="text-center">Это ИИ, а не реальный
          человек.Рассматривай все что он говорит как вымысел.</p>
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #18181b;
}

::-webkit-scrollbar-thumb {
  background: #52525b;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #71717a;
}


@keyframes blink {
  50% {
    fill: transparent
  }
}

.dot {
  animation: 1s blink infinite;
  fill: grey;
}

.dot:nth-child(2) {
  animation-delay: 250ms
}

.dot:nth-child(3) {
  animation-delay: 500ms
}

.loader {
  background-color: transparent;
  color: grey;
}
</style>
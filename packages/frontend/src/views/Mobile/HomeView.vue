<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useDummyMessages, type Message } from '../../stores/messages'
import { onClickOutside } from '@vueuse/core'
import { onBeforeRouteLeave } from 'vue-router';
import { useTextareaAutosize } from '@vueuse/core';
import MessageComponent from '@/components/UI/message.vue';

const { textarea, input } = useTextareaAutosize()


const messages = computed(() => useDummyMessages().markdownMessages);
const messagesContainer = ref<HTMLElement | null>(null);

const sideBar = ref<HTMLElement | null>(null)

const aiTyping = ref(false)
const chatError = ref(false)


async function sendMessage() {
  if (!input.value.trim() || aiTyping.value) return;


  const temp = input.value
  input.value = '';

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

const openSideBar = ref(false)

onClickOutside(sideBar, event => {
  openSideBar.value = false
})


onBeforeRouteLeave(() => {
  if (openSideBar.value) {
    openSideBar.value = false
    return false
  }

})

//block right click 
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

//block select text
document.addEventListener('selectstart', (event) => {
  event.preventDefault();
});

</script>

<template>
  <div class="absolute z-10 top-0 left-0 w-full h-12 backdrop-blur-[15px]">
    <div class="h-12 w-full flex flex-row px-3 items-center" style="background-color: rgba(9, 9, 11, .8);">
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
          <path fill="#888888"
            d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z" />
        </svg>
      </button>
      <div class="ml-4 flex flex-row h-full items-center">
        <img src="https://i.pinimg.com/736x/3d/10/ea/3d10ea6cf880486bb8eaae3f5880db4b.jpg" alt=""
          class="w-[2rem] h-[2rem] rounded-full object-cover">
        <div class="flex flex-col ml-2 ">
          <p class="text-zinc-200 text-sm font-semibold">
            {{ useDummyMessages().charName }}
          </p>
          <p class="text-zinc-500 text-xs">
            prod. isa
          </p>
        </div>

      </div>
      <button class="ml-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
          <path fill="#888888"
            d="M12 20q-.825 0-1.412-.587T10 18t.588-1.412T12 16t1.413.588T14 18t-.587 1.413T12 20m0-6q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-6q-.825 0-1.412-.587T10 6t.588-1.412T12 4t1.413.588T14 6t-.587 1.413T12 8" />
        </svg>
      </button>
    </div>
  </div>


  <div class="flex flex-col h-full bg-zinc-950 items-center w-full">
    <!-- Область сообщений -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950 max-w-2xl w-full " ref="messagesContainer">
      <div class="mt-20"></div>
      <MessageComponent v-for="(message, index) in messages" :key="index" :message="(message as Message)" />
      <MessageComponent v-if="aiTyping" :slotMode="true">
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
      </MessageComponent>

      <MessageComponent v-if="chatError" :slotMode="true">
        <div @click="resendMessgae"
          class="max-w-xs sm:max-w-md md:max-w-lg rounded-2xl px-4 py-2.5 bg-zinc-800 text-zinc-200 rounded bg-zinc-700 cursor-pointer hover:bg-zinc-600 duration-200 -ml-2">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
              <path fill="#fff"
                d="M12.077 19q-2.931 0-4.966-2.033q-2.034-2.034-2.034-4.964t2.034-4.966T12.077 5q1.783 0 3.339.847q1.555.847 2.507 2.365V5.5q0-.213.144-.356T18.424 5t.356.144t.143.356v3.923q0 .343-.232.576t-.576.232h-3.923q-.212 0-.356-.144t-.144-.357t.144-.356t.356-.143h3.2q-.78-1.496-2.197-2.364Q13.78 6 12.077 6q-2.5 0-4.25 1.75T6.077 12t1.75 4.25t4.25 1.75q1.787 0 3.271-.968q1.485-.969 2.202-2.573q.085-.196.274-.275q.19-.08.388-.013q.211.067.28.275t-.015.404q-.833 1.885-2.56 3.017T12.077 19" />
            </svg>
          </p>
        </div>
      </MessageComponent>
    </div>

    <!-- Форма ввода -->
    <div class="p-4 max-w-2xl w-full ">
      <div class="flex items-center space-x-2">
        <textarea ref="textarea" v-model="input" type="text"
          :placeholder="'Сообщение для' + ' ' + useDummyMessages().charName"
          class="w-full max-h-40 px-4 py-2 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none  resize-none " />
        <button v-ripple="{ color: 'rgba(0, 0, 0, 0.3)', duration: 800 }" @click="sendMessage"
          class="p-2 px-2.5 rounded-full bg-white" :class="{ 'opacity-50  ': !input.trim() || aiTyping }">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
            <path fill="#000"
              d="M5.133 18.02q-.406.163-.77-.066T4 17.288v-3.942L9.846 12L4 10.654V6.712q0-.438.364-.666t.77-.067l12.512 5.269q.49.225.49.756q0 .53-.49.748z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea::-webkit-scrollbar {
  display: none;
}


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
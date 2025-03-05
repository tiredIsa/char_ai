<script setup lang="ts">
import { useDummyMessages } from '../../stores/messages';
import { ref, } from 'vue';
import DropdownMenu from './MessageDropdown.vue';
import { computed } from 'vue';
import { Haptic } from '@/utils/haptic';

const props = defineProps<{
    index?: number
    slotMode?: boolean
}>()

const emit = defineEmits(['menuSelect']);
const message = computed(() => {
    //vue издевается надо мной :c
    if (props.slotMode) {
        return {
            role: 'system',
            userRate: undefined,
            parts: [{ text: '' }]
        }
    }
    return useDummyMessages().messages[(props.index || 0)]
});

const isMenuOpen = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const menuOpenDirection = ref<'left' | 'right'>('right');
const windowWidth = ref(window.innerWidth);

const userMenuOptions = [
    { id: 'copy', label: 'Копировать', disabled: true, icon: 'copy' },
    { id: 'select', label: 'Выбрать текст', disabled: true, icon: 'selectText' },
    { id: 'edit', label: 'Редактировать', disabled: true, icon: 'editText' },
    { id: 'delete', label: 'Удалить', disabled: true, icon: 'delete' },
];

const botMenuOptions = [
    { id: 'copy', label: 'Копировать', disabled: true, icon: 'copy' },
    { id: 'select', label: 'Выбрать текст', disabled: true, icon: 'selectText' },
    { id: 'goodAnswer', label: 'Хороший ответ', disabled: true, icon: 'like' },
    { id: 'badAnswer', label: 'Плохой ответ', disabled: true, icon: 'dislike' },
    { id: 'delete', label: 'Удалить', disabled: true, icon: 'delete' },
];

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
}

const changeUserRate = (type: 'good' | 'bad') => {
    if (!message.value || !props.index && props.index !== 0) return
    const prevRate = message.value.userRate
    if (prevRate === type) {
        useDummyMessages().messages[props.index].userRate = undefined
    } else {
        useDummyMessages().messages[props.index].userRate = type
    }
}

const deleteMessage = () => {
    //костыли круто
    setTimeout(() => {
        if (!message.value || !props.index && props.index !== 0) return
        useDummyMessages().messages.splice(props.index, 1)
    }, 300)
}

const handleMessageTap = async (event: MouseEvent) => {
    if (props.slotMode) return;
    Haptic.impact('soft')
    event.stopPropagation();
    menuPosition.value = { x: event.clientX, y: event.clientY };
    menuOpenDirection.value = determineMenuDirection(event.clientX);
    isMenuOpen.value = true;
}

const determineMenuDirection = (x: number) => {
    return x < windowWidth.value / 2 ? 'right' : 'left';
}

const handleMenuSelect = async (option: { id: string }) => {
    Haptic.selectionFeedback()

    switch (option.id) {
        case 'copy':
            copyToClipboard(message.value?.parts[0].text || '');
            break;
        case 'goodAnswer':
            changeUserRate('good');
            break;
        case 'badAnswer':
            changeUserRate('bad');
            break;
        case 'delete':
            deleteMessage();
            break;
    }
    emit('menuSelect', { option, message: message.value });
}


</script>

<template>
    <div class="message-show" :class="{ 'mr-auto': message?.role !== 'user', 'ml-auto': message?.role === 'user', }">
        <div class="flex items-start" :class="message?.role === 'user' ? 'flex-row-reverse' : ''">
            <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                :class="message?.role === 'user' ? 'bg-zinc-700 ml-2' : 'bg-white mr-2'">
                <span class="text-xs" :class="message?.role === 'user' ? 'text-white' : 'text-black'">
                    {{ message?.role === 'user' ? 'U' : 'AI' }}
                </span>
            </div>
            <div class="flex flex-col gap-2">
                <div class="text-zinc-200 text-xs"
                    :class="{ 'text-right pr-2': message?.role === 'user', 'pl-2': message?.role !== 'user' }">
                    {{ message?.role === 'user' ? 'Пользователь' : useDummyMessages().charName }}
                </div>
                <div v-ripple v-if="!slotMode" @click="handleMessageTap"
                    class="max-w-xs sm:max-w-md md:max-w-lg  px-4 py-2.5 bg-zinc-800 text-zinc-200 cursor-pointer"
                    :class="{ '-ml-3 rounded-l-xl rounded-r-2xl': message?.role !== 'user', '-mr-3 rounded-r-xl rounded-l-2xl': message?.role === 'user' }">
                    <p v-html="message?.parts[0].text"></p>
                </div>
                <div v-else @click="handleMessageTap">
                    <slot></slot>
                </div>
                <Transition name="fade" mode="out-in">
                    <img v-if="message?.userRate" :key="message?.userRate" class="h-4 w-4"
                        :src="message?.userRate === 'good' ? '/icons/like.svg' : '/icons/dislike.svg'" alt="">
                </Transition>
            </div>
        </div>

        <DropdownMenu :isOpen="isMenuOpen" :position="menuPosition" :direction="menuOpenDirection"
            :menuOptions="message?.role === 'user' ? userMenuOptions : botMenuOptions" @close="isMenuOpen = false"
            @select="handleMenuSelect" />
    </div>
</template>

<style>
.message-show {
    animation: message-show 0.2s ease-in-out;
}

@keyframes message-show {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-enter-active {
    animation: fade-slide-in 0.3s;
}

.fade-leave-active {
    animation: fade-slide-in 0.3s reverse;
}

@keyframes fade-slide-in {
    0% {
        opacity: 0;
        transform: translateX(-10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
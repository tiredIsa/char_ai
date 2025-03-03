<script setup lang="ts">
import { useDummyMessages, type Message } from '@/stores/messages';
import { watch } from 'vue';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps<{
    message?: Message
    slotMode?: boolean
}>()

const emit = defineEmits(['menuSelect']);

// Состояние для выпадающего меню
const isMenuOpen = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const dropdownRef = ref<HTMLElement | null>(null);
const menuInstance = ref<string | null>(null);
const menuOpenDirection = ref<'left' | 'right'>('right');
const windowWidth = ref(window.innerWidth);

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
}

// Опции меню
const userMenuOptions = [
    { id: 'copy', label: 'Копировать', disabled: true, icon: 'copy', function: () => copyToClipboard(props.message?.parts[0].text || '') },
    { id: 'select', label: 'Выбрать текст', disabled: true, icon: 'selectText' },
    { id: 'edit', label: 'Редактировать', disabled: true, icon: 'editText' },
    { id: 'delete', label: 'Удалить', disabled: true, icon: 'delete' },
];

const botMenuOptions = [
    { id: 'copy', label: 'Копировать', disabled: true, icon: 'copy', function: () => copyToClipboard(props.message?.parts[0].text || '') },
    { id: 'select', label: 'Выбрать текст', disabled: true, icon: 'selectText' },
    { id: 'goodAnswer', label: 'Хороший ответ', disabled: true, icon: 'like' },
    { id: 'badAnswer', label: 'Плохой ответ', disabled: true, icon: 'dislike' },
    { id: 'delete', label: 'Удалить', disabled: true, icon: 'delete' },

];

// Глобальная переменная для затемненного фона
const isOverlayVisible = ref(false);

// Генерация уникального идентификатора для меню
const generateMenuId = () => `menu-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Глобальная переменная для текущего активного меню
const globalCurrentMenu = ref<string | null>(null);

// Определение направления открытия меню
function determineMenuDirection(x: number) {
    const screenWidth = windowWidth.value;
    return x < screenWidth / 2 ? 'right' : 'left';
}

// Обработчик клика на сообщение
function handleMessageTap(event: MouseEvent) {
    event.stopPropagation();
    const currentMenuId = generateMenuId();

    if (isMenuOpen.value) {
        closeCurrentMenu();
        return;
    }

    if (globalCurrentMenu.value && globalCurrentMenu.value !== menuInstance.value) {
        document.dispatchEvent(new CustomEvent('closeAllMenus', { detail: { exceptId: currentMenuId } }));
    }

    menuPosition.value = { x: event.clientX, y: event.clientY };
    menuOpenDirection.value = determineMenuDirection(event.clientX);
    menuInstance.value = currentMenuId;
    globalCurrentMenu.value = currentMenuId;
    isOverlayVisible.value = true;
    isMenuOpen.value = true; // Открываем сразу, анимация управляется transition
}

// Закрытие меню
function closeCurrentMenu() {
    isMenuOpen.value = false;
    isOverlayVisible.value = false;
    globalCurrentMenu.value = null;
}

// Выбор опции меню
function selectMenuOption(option: { id: string, label: string }) {
    emit('menuSelect', { option, message: props.message });
    closeCurrentMenu();
}

// Обработчик закрытия всех меню
function handleCloseAllMenus(event: CustomEvent) {
    const { exceptId } = event.detail;
    if (menuInstance.value !== exceptId) {
        isMenuOpen.value = false;
        if (globalCurrentMenu.value === menuInstance.value) {
            isOverlayVisible.value = false;
        }
    }
}

onMounted(() => {
    document.addEventListener('closeAllMenus', handleCloseAllMenus as EventListener);
    nextTick(() => {
        if (!document.getElementById('global-menu-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'global-menu-overlay';
            overlay.className = 'menu-overlay';
            overlay.addEventListener('click', () => document.dispatchEvent(new CustomEvent('closeAllMenus', { detail: { exceptId: null } })));
            document.body.appendChild(overlay);
        }
    });
});

onUnmounted(() => {
    document.removeEventListener('closeAllMenus', handleCloseAllMenus as EventListener);
    if (globalCurrentMenu.value === menuInstance.value) {
        globalCurrentMenu.value = null;
    }
});

// Управление видимостью overlay
watch(isOverlayVisible, (newValue) => {
    const overlay = document.getElementById('global-menu-overlay');
    if (overlay) {
        if (newValue) overlay.classList.add('visible');
        else overlay.classList.remove('visible');
    }
});
</script>

<template>
    <div class="message-show" :class="{ 'ml-auto': message?.role === 'user', 'mr-auto': message?.role !== 'user' }">
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
            </div>
        </div>

        <!-- Выпадающее меню с анимацией -->
        <transition name="dropdown">
            <div v-if="isMenuOpen" ref="dropdownRef" class="dropdown-menu py-1"
                :class="menuOpenDirection === 'left' ? 'menu-left' : 'menu-right'" :style="{
                    position: 'fixed',
                    [menuOpenDirection === 'left' ? 'right' : 'left']: menuOpenDirection === 'left' ? `${windowWidth - menuPosition.x}px` : `${menuPosition.x}px`,
                    top: `${menuPosition.y}px`,
                    zIndex: 1010
                }">
                <div v-ripple v-for="option in message?.role === 'user' ? userMenuOptions : botMenuOptions"
                    :key="option.id" class="dropdown-item flex items-center gap-3" @click="selectMenuOption(option)">
                    <img v-if="option.icon" :src="`/icons/${option.icon}.svg`" class="w-5 h-5" alt="">
                    <p class="font-semibold text-sm">{{ option.label }}</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<style>
.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
}

.menu-overlay.visible {
    opacity: 1;
    pointer-events: auto;
}
</style>

<style scoped>
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

.dropdown-enter-active {
    animation: dropdown-appear 0.2s;
}

.dropdown-leave-active {
    animation: dropdown-disappear 0.2s;
}

@keyframes dropdown-appear {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes dropdown-disappear {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.95);
    }
}

.dropdown-menu {
    background-color: #2d2d2d;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    min-width: 150px;
}

.menu-left {
    transform-origin: top right;
}

.menu-right {
    transform-origin: top left;
}

.dropdown-item {
    padding: 10px 16px;
    color: #e4e4e7;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.dropdown-item:hover {
    background-color: #3f3f46;
}
</style>
<script setup lang="ts">
import { computed } from 'vue';
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps<{
    isOpen: boolean;
    position: { x: number; y: number };
    direction: 'left' | 'right';
    menuOptions: Array<{ id: string; label: string; disabled?: boolean; icon?: string }>;
}>();

const emit = defineEmits(['close', 'select']);

const dropdownRef = ref<HTMLElement | null>(null);
const menuInstance = ref<string | null>(null);
const isOverlayVisible = ref(false);
const globalCurrentMenu = ref<string | null>(null);

const generateMenuId = () => `menu-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        emit('close');
    }
}

const handleCloseAllMenus = (event: CustomEvent) => {
    const { exceptId } = event.detail;
    if (menuInstance.value !== exceptId) {
        emit('close');
    }
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('closeAllMenus', handleCloseAllMenus as EventListener);

    if (!document.getElementById('global-menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'global-menu-overlay';
        overlay.className = 'menu-overlay';
        overlay.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('closeAllMenus', { detail: { exceptId: null } }));
        });
        document.body.appendChild(overlay);
    }

    isOverlayVisible.value = props.isOpen;
});

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('closeAllMenus', handleCloseAllMenus as EventListener);
    if (globalCurrentMenu.value === menuInstance.value) {
        globalCurrentMenu.value = null;
    }
});

watch(() => props.isOpen, (newVal) => {
    isOverlayVisible.value = newVal;
    if (newVal) {
        menuInstance.value = generateMenuId();
        globalCurrentMenu.value = menuInstance.value;
        document.dispatchEvent(new CustomEvent('closeAllMenus', { detail: { exceptId: menuInstance.value } }));
    }
});

watch(isOverlayVisible, (newVal) => {
    const overlay = document.getElementById('global-menu-overlay');
    if (overlay) {
        overlay.classList.toggle('visible', newVal);
    }
});

const selectOption = (option: { id: string; label: string }) => {
    emit('select', option);
    emit('close');
}

const _window = computed(() => window);

</script>

<template>
    <transition name="dropdown">
        <div v-if="isOpen" ref="dropdownRef" class="dropdown-menu py-1"
            :class="direction === 'left' ? 'menu-left' : 'menu-right'" :style="{
                position: 'fixed',
                [direction === 'left' ? 'right' : 'left']: direction === 'left'
                    ? `${_window.innerWidth - position.x}px`
                    : `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 1010
            }">
            <div v-ripple v-for="option in menuOptions" :key="option.id" class="dropdown-item flex items-center gap-3"
                @click="selectOption(option)">
                <img v-if="option.icon" :src="`/icons/${option.icon}.svg`" class="w-5 h-5" alt="">
                <p class="font-semibold text-sm">{{ option.label }}</p>
            </div>
        </div>
    </transition>
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
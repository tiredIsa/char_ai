// ripple.ts
import type { ObjectDirective, App } from 'vue'

// Интерфейс для настроек ripple эффекта
interface RippleOptions {
  color?: string
  duration?: number
}

// Расширяем интерфейс HTMLElement для хранения обработчика
interface RippleHTMLElement extends HTMLElement {
  _rippleHandler?: (e: MouseEvent) => void
}

export const vRipple: ObjectDirective<RippleHTMLElement, RippleOptions> = {
  mounted(el, binding) {
    initRipple(el, binding.value)
  },
  updated(el, binding) {
    initRipple(el, binding.value)
  },
  beforeUnmount(el) {
    // Очищаем обработчик при удалении элемента
    if (el._rippleHandler) {
      el.removeEventListener('mousedown', el._rippleHandler)
      delete el._rippleHandler
    }
  },
}

function initRipple(el: RippleHTMLElement, value?: RippleOptions): void {
  // Базовые стили
  el.style.position = 'relative'
  el.style.overflow = 'hidden'
  el.style.userSelect = 'none'

  // Опции
  const options = value || {}
  const color = options.color || 'rgba(255, 255, 255, 0.35)'
  const duration = options.duration || 500

  // Удаляем предыдущий обработчик
  if (el._rippleHandler) {
    el.removeEventListener('mousedown', el._rippleHandler)
  }

  // Создаем новый обработчик
  const rippleHandler = (e: MouseEvent) => {
    // Проверка на отключенное состояние
    if (el.hasAttribute('disabled') || el.classList.contains('disabled')) {
      return
    }

    // Удаление существующих эффектов
    const ripples = el.querySelectorAll('.v-ripple-effect')
    ripples.forEach((ripple) => ripple.remove())

    // Создание ripple элемента
    const ripple = document.createElement('span')
    ripple.className = 'v-ripple-effect'

    // Вычисление размеров и позиции
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    // Применение стилей
    Object.assign(ripple.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: color,
      transform: 'scale(0)',
      pointerEvents: 'none',
      left: `${offsetX - size / 2}px`,
      top: `${offsetY - size / 2}px`,
    })

    // Добавляем элемент и запускаем анимацию
    el.appendChild(ripple)

    const animation = ripple.animate(
      [
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1)', opacity: 0 },
      ],
      {
        duration: duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    )

    animation.onfinish = () => ripple.remove()
  }

  // Сохраняем и добавляем обработчик
  el._rippleHandler = rippleHandler
  el.addEventListener('mousedown', rippleHandler)
}

// Плагин для Vue
export default {
  install(app: App) {
    app.directive('ripple', vRipple)
  },
}

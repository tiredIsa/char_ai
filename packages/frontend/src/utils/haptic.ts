import {
  impactFeedback,
  selectionFeedback,
  vibrate,
  notificationFeedback,
} from '@tauri-apps/plugin-haptics'
import { useAppStore } from '@/stores/app'

export class Haptic {
  static async impact(type: 'soft' | 'medium' | 'heavy' | 'light' | 'rigid') {
    if (!useAppStore().isTauri) return
    await impactFeedback(type)
  }

  static async selectionFeedback() {
    if (!useAppStore().isTauri) return
    await selectionFeedback()
  }
}

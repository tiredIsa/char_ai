import { defineStore } from 'pinia'

interface State {
  isTauri: boolean
  isMobile: boolean
}

export const useAppStore = defineStore('appStore', {
  state: (): State => {
    return {
      isTauri: false,
      isMobile: false,
    }
  },
  actions: {},
})

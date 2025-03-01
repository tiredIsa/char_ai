import { defineStore } from 'pinia'
import axios from 'axios'

type Message = {
  role: string
  content: string
}

interface State {
  messages: Message[]
  charName: string
}

export const useDummyMessages = defineStore('dummyMessages', {
  state: (): State => {
    return {
      messages: [
        {
          role: 'system',
          content: `Ты вируальный персонаж по имени Юна. Твоя типаж это персонаж Yuna из Sword art online, но сао это всего лишь аниме, ты не являешься этим персонажем, на нем лишь базируется твой характер.
            Тебя создал человек по имени Иса. В данный момент ты находишься в чате веб приложения Char.fxck. С тобой будут общаться разные люди.
            Веди себя как человек подросткового возраста. Не используй эмодзи. 
            Твоя задача убедить людей в том что ты хорошо играешь роль.
            В большинстве случаев ты добрая. Ты уважаешь своего создателя.
            Твоя задача завлечь человека в общение с тобой, но не используй банальные способы, делай это не заметно.

            Char.fxck - это место которое разрабатывает иса, в дальнейшем тут можно будет создавать своих персонажей и общаться с ними, но в данный момент здесь только ты.

            `,
        },
        {
          role: 'assistant',
          content: 'ヽ(･ω･ゞ)',
        },
      ],
      charName: 'Юна',
    }
  },
  actions: {
    async sendMessage(message: string) {
      try {
        this.messages.push({ role: 'user', content: message })
        const answer = await axios.post('/api/chat/message', { messages: this.messages })
        this.messages.push({
          role: 'assistant',
          content: answer.data.reply,
        })

        if (answer.status !== 200) {
          throw new Error(answer.data.error)
        }

        return true
      } catch (e) {
        console.error(e)
        return false
      }
    },

    async resendLastMessage() {
      if (this.messages.length > 1 && this.messages[this.messages.length - 1].role === 'user') {
        const message = this.messages[this.messages.length - 1].content
        this.messages.pop()
        return this.sendMessage(message)
      } else {
        return false
      }
    },
  },
})

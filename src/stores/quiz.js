import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', () => {
  const username = ref(localStorage.getItem('username')||'')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { username, doubleCount, increment }
})

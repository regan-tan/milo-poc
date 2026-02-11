<script setup lang="ts">
import { ref } from 'vue'
import { transformSlide } from '../services/api'
import { useSlideState } from '../composables/useSlideState'

/* ---- State ---- */
const { state: slide, applyUpdate } = useSlideState()

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

const messages = ref<ChatMessage[]>([])
const input = ref('')
const loading = ref(false)

/* ---- Actions ---- */
async function send() {
  const prompt = input.value.trim()
  if (!prompt || loading.value) return

  messages.value.push({ role: 'user', text: prompt })
  input.value = ''
  loading.value = true

  try {
    const result = await transformSlide(prompt, slide.currentHtml, slide.currentCss)
    applyUpdate(result)
    messages.value.push({ role: 'assistant', text: 'Slide updated.' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Something went wrong.'
    messages.value.push({ role: 'assistant', text: `Error: ${msg}` })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <aside class="chat-panel">
    <!-- Header -->
    <div class="chat-header">
      <h2>What can I help with?</h2>
    </div>

    <!-- Message list -->
    <div class="chat-messages">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="chat-bubble"
        :class="msg.role"
      >
        {{ msg.text }}
      </div>
      <div v-if="loading" class="chat-bubble assistant loading-bubble">
        Updating slide…
      </div>
    </div>

    <!-- Input -->
    <form class="chat-input-row" @submit.prevent="send">
      <input
        v-model="input"
        type="text"
        placeholder="Ask anything"
        :disabled="loading"
        class="chat-input"
      />
      <button type="submit" class="chat-send" :disabled="loading || !input.trim()">
        ➜
      </button>
    </form>
  </aside>
</template>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e5e5e5;
}

.chat-header {
  padding: 24px 20px 12px;
}

.chat-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #1e1e1e;
}

/* ---- Messages ---- */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-bubble {
  max-width: 90%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.45;
  word-break: break-word;
}

.chat-bubble.user {
  align-self: flex-end;
  background: #1e1e1e;
  color: #fff;
}

.chat-bubble.assistant {
  align-self: flex-start;
  background: #f0f0f0;
  color: #333;
}

.loading-bubble {
  opacity: 0.7;
  font-style: italic;
}

/* ---- Input row ---- */
.chat-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e5e5;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.chat-input:focus {
  border-color: #999;
}

.chat-send {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #1e1e1e;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;
}

.chat-send:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>

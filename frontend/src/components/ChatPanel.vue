<template>
  <div class="chat-panel" :class="{ collapsed: isCollapsed, 'mobile-open': mobileOpen }">
    <!-- Header -->
    <div class="chat-header">
      <div class="chat-header-left">
        <span class="chat-title">Canvas AI</span>
        <select class="model-selector" v-model="selectedModel">
          <option v-for="m in availableModels" :key="m.value" :value="m.value">
            {{ m.label }}
          </option>
        </select>
      </div>
      <div class="chat-header-actions">
        <button class="chat-icon-btn" title="Clear chat" @click="handleClear">
          <span>🗑</span>
        </button>
        <button class="chat-icon-btn" title="Toggle panel" @click="handleToggle">
          <span>{{ isCollapsed ? '◀' : '▶' }}</span>
        </button>
      </div>
    </div>

    <!-- API key warning -->
    <div v-if="!apiKeyConfigured && !isCollapsed" class="api-key-banner">
      <div class="api-key-msg">⚠️ OpenAI API key not set</div>
      <div class="api-key-form">
        <input
          type="password"
          v-model="apiKeyInput"
          placeholder="sk-..."
          class="api-key-input"
          @keydown.enter="handleSetKey"
        />
        <button class="api-key-btn" @click="handleSetKey">Set</button>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="!isCollapsed" class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="chat-empty">
        <div class="chat-empty-icon">💬</div>
        <div class="chat-empty-text">Ask me to create or edit canvas elements.</div>
        <div class="chat-empty-hint">Try: "Create a text box that says Hello World"</div>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="chat-bubble"
        :class="msg.role"
      >
        <div class="bubble-content">{{ msg.content }}</div>
        <div v-if="msg.commands && msg.commands.length" class="bubble-commands">
          {{ msg.commands.length }} command{{ msg.commands.length > 1 ? 's' : '' }} executed
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="chat-bubble assistant loading">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div v-if="!isCollapsed" class="chat-input-area">
      <textarea
        class="chat-input"
        v-model="inputText"
        placeholder="Message Canvas AI..."
        rows="2"
        @keydown="handleKeyDown"
      ></textarea>
      <button
        class="chat-send-btn"
        :disabled="!inputText.trim() || isLoading"
        @click="handleSend"
      >
        ➤
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue';

const props = defineProps({
  messages: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  selectedModel: { type: String, default: 'gpt-4' },
  availableModels: { type: Array, default: () => [] },
  apiKeyConfigured: { type: Boolean, default: false },
  mobileOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['send', 'clear', 'update:selectedModel', 'set-api-key', 'close-mobile']);

const isCollapsed = ref(false);
const inputText = ref('');
const apiKeyInput = ref('');
const messagesContainer = ref(null);

// Two-way binding for model
const selectedModel = ref(props.selectedModel);
watch(selectedModel, (val) => emit('update:selectedModel', val));
watch(() => props.selectedModel, (val) => { selectedModel.value = val; });

// Auto-scroll when messages change
watch(() => props.messages.length, () => {
  nextTick(() => scrollToBottom());
});
watch(() => props.isLoading, () => {
  nextTick(() => scrollToBottom());
});

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function handleSend() {
  const text = inputText.value.trim();
  if (!text) return;
  emit('send', text);
  inputText.value = '';
}

function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

function handleToggle() {
  if (window.innerWidth < 768) {
    // On mobile: close the bottom sheet via parent
    emit('close-mobile');
  } else {
    // On desktop: toggle collapsed sidebar
    isCollapsed.value = !isCollapsed.value;
  }
}

function handleClear() {
  emit('clear');
}

function handleSetKey() {
  const key = apiKeyInput.value.trim();
  if (key) {
    emit('set-api-key', key);
    apiKeyInput.value = '';
  }
}

onMounted(() => {
  scrollToBottom();
});
</script>

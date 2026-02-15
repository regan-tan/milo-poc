<template>
  <div class="app-container">
    <div class="canvas-side">
      <Toolbar
        @create-textbox="createTextBox"
        @format-text="formatText"
      />
      <CanvasArea
        :textBoxes="textBoxes"
        :activeTextBoxId="activeTextBoxId"
        @select-textbox="selectTextBox"
        @update-textbox="updateTextBox"
        @deactivate-all="deactivateAll"
      />
    </div>

    <!-- Mobile overlay: tap to close the AI panel -->
    <div
      v-if="mobileAiPanelOpen"
      class="mobile-panel-overlay"
      @click="mobileAiPanelOpen = false"
      aria-hidden="true"
    />

    <ChatPanel
      :messages="chat.messages.value"
      :isLoading="chat.isLoading.value"
      :selectedModel="chat.selectedModel.value"
      :availableModels="chat.availableModels"
      :apiKeyConfigured="chat.apiKeyConfigured.value"
      :mobileOpen="mobileAiPanelOpen"
      @send="handleChatSend"
      @clear="chat.clearMessages"
      @update:selectedModel="(m) => chat.selectedModel.value = m"
      @set-api-key="handleSetApiKey"
      @close-mobile="mobileAiPanelOpen = false"
    />

    <!-- Mobile AI toggle FAB (hidden on tablet+) -->
    <button
      class="mobile-ai-toggle"
      aria-label="Open Canvas AI"
      @click="mobileAiPanelOpen = !mobileAiPanelOpen"
    >
      AI
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Toolbar from './components/Toolbar.vue';
import CanvasArea from './components/Canvas.vue';
import ChatPanel from './components/ChatPanel.vue';
import { useChat } from './composables/useChat.js';
import { useCanvasCommands } from './composables/useCanvasCommands.js';

// ---------- Composables ----------
const chat = useChat();
const { getCanvasContext, executeCommands } = useCanvasCommands();

// ---------- Reactive state ----------
const textBoxes = ref([]);
const activeTextBoxId = ref(null);
const mobileAiPanelOpen = ref(false);
let idCounter = 0;

function generateId() {
  idCounter++;
  return 'tb-' + idCounter + '-' + Date.now();
}

// ---------- Create text box ----------
const createTextBox = () => {
  const id = generateId();
  textBoxes.value.push({
    id,
    x: 20 + (idCounter * 14) % 580,
    y: 20 + (idCounter * 14) % 460,
    content: ''
  });
  activeTextBoxId.value = id;
};

// ---------- Select / deactivate ----------
const selectTextBox = (id) => {
  activeTextBoxId.value = id;
};

const deactivateAll = () => {
  activeTextBoxId.value = null;
};

// ---------- Update text box ----------
const updateTextBox = (id, updates) => {
  const tb = textBoxes.value.find(t => t.id === id);
  if (!tb) return;
  if (updates.x !== undefined) tb.x = updates.x;
  if (updates.y !== undefined) tb.y = updates.y;
  if (updates.content !== undefined) tb.content = updates.content;
};

// ---------- Format text ----------
const formatText = (formatType) => {
  if (!activeTextBoxId.value) return;
  document.execCommand(formatType, false, null);
};

// ---------- Chat integration ----------
async function handleChatSend(text) {
  const context = getCanvasContext(textBoxes.value);
  const result = await chat.sendMessage(text, context);

  if (result && result.commands && result.commands.length > 0) {
    executeCommands(result.commands, textBoxes, generateId);
  }
}

async function handleSetApiKey(key) {
  await chat.setApiKey(key);
}

// ---------- Mobile panel ESC close ----------
function handleKeyDown(e) {
  if (e.key === 'Escape' && mobileAiPanelOpen.value) {
    mobileAiPanelOpen.value = false;
  }
}

// ---------- Lifecycle ----------
onMounted(() => {
  chat.checkApiKey();
  chat.loadHistory();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

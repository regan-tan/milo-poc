<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSlideState } from '../composables/useSlideState'

const { state: slide } = useSlideState()

type Tab = 'html' | 'css'
const activeTab = ref<Tab>('html')

const displayCode = computed(() => {
  return activeTab.value === 'html' ? slide.currentHtml : slide.currentCss
})
</script>

<template>
  <aside class="code-panel">
    <!-- Tab bar -->
    <div class="code-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'html' }"
        @click="activeTab = 'html'"
      >
        HTML
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'css' }"
        @click="activeTab = 'css'"
      >
        CSS
      </button>
    </div>

    <!-- Code view -->
    <pre class="code-view"><code>{{ displayCode }}</code></pre>
  </aside>
</template>

<style scoped>
.code-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  color: #d4d4d4;
  border-left: 1px solid #333;
  font-family: 'Consolas', 'Fira Code', 'Courier New', monospace;
}

/* ---- Tabs ---- */
.code-tabs {
  display: flex;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  color: #888;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: color 0.15s, border-color 0.15s;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: #e0e0e0;
  border-bottom-color: #569cd6;
}

.tab-btn:hover:not(.active) {
  color: #bbb;
}

/* ---- Code view ---- */
.code-view {
  flex: 1;
  overflow: auto;
  padding: 16px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}
</style>

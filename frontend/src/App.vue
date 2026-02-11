<script setup lang="ts">
import ChatPanel from './components/ChatPanel.vue'
import SlideCanvas from './components/SlideCanvas.vue'
import CodePanel from './components/CodePanel.vue'
</script>

<template>
  <div class="app-layout">
    <ChatPanel />
    <SlideCanvas />
    <CodePanel />
  </div>
</template>

<style scoped>
.app-layout {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>

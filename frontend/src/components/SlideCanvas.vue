<script setup lang="ts">
import { computed } from 'vue'
import { useSlideState } from '../composables/useSlideState'

const { state: slide } = useSlideState()

/**
 * Build a full HTML document string for the iframe.
 * The CSS is injected in a <style> tag so it's scoped to the iframe.
 */
const srcdoc = computed(() => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
    ${slide.currentCss}
  </style>
</head>
<body>
  ${slide.currentHtml}
</body>
</html>`
})
</script>

<template>
  <section class="slide-canvas-wrapper">
    <div class="canvas-viewport">
      <iframe
        class="canvas-iframe"
        :srcdoc="srcdoc"
        sandbox="allow-same-origin"
        title="Slide preview"
      ></iframe>
    </div>
  </section>
</template>

<style scoped>
.slide-canvas-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f0f0f0;
  padding: 32px;
}

.canvas-viewport {
  width: 100%;
  max-width: 720px;
  aspect-ratio: 16 / 10;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  /* Dot-grid background matching the screenshot */
  background-image: radial-gradient(circle, #d6d6d6 1px, transparent 1px);
  background-size: 20px 20px;
  position: relative;
}

.canvas-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>

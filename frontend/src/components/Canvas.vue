<template>
  <div class="canvas" ref="canvasRef" @mousedown="handleCanvasClick">
    <TextBox
      v-for="tb in textBoxes"
      :key="tb.id"
      :textBox="tb"
      :isActive="tb.id === activeTextBoxId"
      :canvasWidth="720"
      :canvasHeight="540"
      @select="$emit('select-textbox', tb.id)"
      @update="(updates) => $emit('update-textbox', tb.id, updates)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TextBox from './TextBox.vue';

defineProps({
  textBoxes: { type: Array, default: () => [] },
  activeTextBoxId: { type: [String, null], default: null }
});

const emit = defineEmits(['select-textbox', 'update-textbox', 'deactivate-all']);

const canvasRef = ref(null);

function handleCanvasClick(e) {
  // Deactivate all text boxes when clicking blank canvas area
  if (e.target === canvasRef.value) {
    emit('deactivate-all');
  }
}
</script>

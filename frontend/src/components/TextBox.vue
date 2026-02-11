<template>
  <div
    class="textbox"
    :class="{ active: isActive, editing: isEditing, dragging: dragging }"
    :style="{ left: textBox.x + 'px', top: textBox.y + 'px' }"
    :contenteditable="isEditing"
    @mousedown.stop="handleMouseDown"
    @dblclick.stop="enterEditMode"
    @input="handleInput"
    @blur="exitEditMode"
    ref="boxRef"
  ></div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useDrag } from '../composables/useDrag.js';

const props = defineProps({
  textBox: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
  canvasWidth: { type: Number, default: 720 },
  canvasHeight: { type: Number, default: 540 }
});

const emit = defineEmits(['select', 'update']);

const boxRef = ref(null);
const dragging = ref(false);
const isEditing = ref(false);
const { startDrag } = useDrag();

/**
 * Double-click enters editing (contenteditable) mode.
 */
function enterEditMode() {
  isEditing.value = true;
  nextTick(() => {
    if (boxRef.value) boxRef.value.focus();
  });
}

/**
 * Exit editing mode on blur.
 */
function exitEditMode() {
  isEditing.value = false;
}

function handleInput(e) {
  emit('update', { content: e.target.innerHTML });
}

/**
 * Mousedown always starts drag (unless in editing mode).
 */
function handleMouseDown(e) {
  emit('select');

  // If we are in editing mode, let the cursor/selection work normally
  if (isEditing.value) return;

  const el = boxRef.value;
  if (!el) return;

  const elWidth = el.offsetWidth;
  const elHeight = el.offsetHeight;

  const boundaries = {
    minX: 0,
    minY: 0,
    maxX: props.canvasWidth - elWidth,
    maxY: props.canvasHeight - elHeight
  };

  dragging.value = true;

  startDrag(
    e,
    props.textBox.x,
    props.textBox.y,
    boundaries,
    (pos) => {
      emit('update', { x: pos.x, y: pos.y });
    },
    () => {
      dragging.value = false;
    }
  );
}

// Exit editing when the box is deactivated
watch(() => props.isActive, (active) => {
  if (!active) {
    isEditing.value = false;
  }
});

// Set initial content
onMounted(() => {
  if (boxRef.value && props.textBox.content) {
    boxRef.value.innerHTML = props.textBox.content;
  }
});
</script>

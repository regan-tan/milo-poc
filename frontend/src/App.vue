<template>
  <div class="app-container">
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
</template>

<script setup>
import { ref } from 'vue';
import Toolbar from './components/Toolbar.vue';
import CanvasArea from './components/Canvas.vue';

// ---------- Reactive state ----------
const textBoxes = ref([]);
const activeTextBoxId = ref(null);
let idCounter = 0;

// ---------- Create text box ----------
const createTextBox = () => {
  idCounter++;
  const id = 'tb-' + idCounter + '-' + Date.now();
  textBoxes.value.push({
    id,
    x: 20 + (idCounter * 14) % 280,
    y: 20 + (idCounter * 14) % 200,
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
</script>

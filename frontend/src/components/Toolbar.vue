<template>
  <div class="toolbar">
    <button class="toolbar-btn btn-create" title="Create Text Box" @click="$emit('create-textbox')">T</button>
    <button class="toolbar-btn" title="Bold" @click="$emit('format-text', 'bold')"><b>B</b></button>
    <button class="toolbar-btn" title="Underline" @click="$emit('format-text', 'underline')"><u>U</u></button>
    <button class="toolbar-btn" title="Italic" @click="$emit('format-text', 'italic')"><i>I</i></button>
  </div>
</template>

<script setup>
defineEmits(['create-textbox', 'format-text']);
</script>

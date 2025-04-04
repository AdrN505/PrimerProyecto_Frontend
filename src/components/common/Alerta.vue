<!-- components/common/Alerta.vue -->

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  mensaje: {
    type: String,
    default: ''
  },
  tipo: {
    type: String,
    default: 'success'
  }
});

const emit = defineEmits(['update:visible']);
</script>

<template>
  <v-alert
    v-if="visible"
    :type="tipo"
    closable
    transition="scale-transition"
    class="mb-4"
    @update:model-value="$emit('update:visible', $event)"
  >
    {{ mensaje }}
  </v-alert>
</template>
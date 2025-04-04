<script setup>
import { defineProps, defineEmits, ref, watch, reactive } from 'vue';
import { NIVELES_URGENCIA, REGLAS_VALIDACION } from '@/config/constants';
import { incidenciasService } from '@/services/incidenciasService';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  incidencia: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:show', 'guardar']);
</script>

<template>
  <v-btn density="compact" size="small" class="mr-1" @click="abrirEditor" 
      color="blue" icon>
      <v-icon size="small">mdi-pencil</v-icon>
  </v-btn>
</template>

<style>

</style>
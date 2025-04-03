<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  incidencia: Object,
  coloresUrgencia: Object
});

const emit = defineEmits(['update:show', 'editar', 'eliminar']);

// Función para determinar el color según el nivel de urgencia
const getUrgenciaColor = (urgencia) => 
  props.coloresUrgencia[urgencia?.toLowerCase()] || 'grey';

// Método para cerrar el diálogo
const cerrar = () => {
  emit('update:show', false);
};

// Métodos para las acciones
const editar = () => {
  emit('editar', props.incidencia.id);
};

const eliminar = () => {
  emit('eliminar', props.incidencia.id);
};
</script>

<template>
  <v-dialog :model-value="show" max-width="500" @update:model-value="$emit('update:show', $event)">
    <v-card v-if="incidencia">
      <v-card-title class="text-h5 bg-purple-lighten-4">
        Detalle de Incidencia #{{ incidencia.id }}
        <v-chip 
          :color="getUrgenciaColor(incidencia.urgencia)" 
          class="ml-2"
        >
          {{ incidencia.urgencia }}
        </v-chip>
      </v-card-title>
      
      <v-card-text class="mt-4">
        <h3 class="text-h6 mb-2">{{ incidencia.titulo }}</h3>
        
        <v-divider class="mb-4"></v-divider>
        
        <p class="text-body-1">{{ incidencia.descripcion }}</p>
        
        <v-divider class="my-4"></v-divider>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="blue" 
          @click="editar"
        >
          <v-icon left>mdi-pencil</v-icon>
          Editar
        </v-btn>
        <v-btn 
          color="error" 
          @click="eliminar"
        >
          <v-icon left>mdi-delete</v-icon>
          Eliminar
        </v-btn>
        <v-btn
          color="grey-darken-1"
          @click="cerrar"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
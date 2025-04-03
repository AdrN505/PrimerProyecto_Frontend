<script setup>
import { defineProps, defineEmits, ref, watch, reactive } from 'vue';

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

// Opciones de urgencia para el select
const opcionesUrgencia = [
    'Baja', 'Media', 'Alta', 'Muy Alta'
];

// Formulario reactivo
const formulario = reactive({
  titulo: '',
  descripcion: '',
  urgencia: ''
});

// Validación básica
const valido = ref(true);
const reglas = {
  requerido: [v => !!v || 'Este campo es requerido']
};

// Observar cambios en la incidencia seleccionada para actualizar el formulario
watch(() => props.incidencia, (nuevaIncidencia) => {
  if (nuevaIncidencia) {
    formulario.titulo = nuevaIncidencia.titulo || '';
    formulario.descripcion = nuevaIncidencia.descripcion || '';
    formulario.urgencia = nuevaIncidencia.urgencia || '';
  }
}, { immediate: true });

// Función para manejar el guardado
const guardar = () => {
  if (valido.value) {
    emit('guardar', {
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      urgencia: formulario.urgencia
    });
  }
};

// Función para cerrar el diálogo
const cerrar = () => {
  emit('update:show', false);
};
</script>

<template>
  <v-dialog :model-value="show" max-width="600px" @update:model-value="emit('update:show', $event)">
    <v-card>
      <v-card-title class="text-h5 bg-purple text-white">
        Editar Incidencia #{{ incidencia?.id }}
      </v-card-title>
      
      <v-card-text class="pt-4">
        <v-form v-model="valido" @submit.prevent="guardar">
          <v-text-field
            v-model="formulario.titulo"
            label="Título"
            :rules="reglas.requerido"
            required
          ></v-text-field>
          
          <v-text-field
            v-model="formulario.descripcion"
            label="Descripción"
            :rules="reglas.requerido"
            required
            rows="4"
          ></v-text-field>
          
          <v-select
            v-model="formulario.urgencia"
            :items="opcionesUrgencia"
            label="Nivel de urgencia"
            :rules="reglas.requerido"
            required
          ></v-select>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="cerrar">Cancelar</v-btn>
        <v-btn color="purple" @click="guardar" :disabled="!valido">Guardar Cambios</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
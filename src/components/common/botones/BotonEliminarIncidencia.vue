<script setup>
import { defineProps, defineEmits, ref, watch, reactive } from 'vue';
import { NIVELES_URGENCIA, REGLAS_VALIDACION } from '@/config/constants';

const props = defineProps({
  incidencia: {
    type: Object,
    default: null
  }
});

const dialog = ref(false);
// Formulario reactivo
const formulario = reactive({
  id: '',
  titulo: '',
  descripcion: '',
  urgencia: ''
});

// Función para abrir el diálogo
const abrirEditor = () => {
  dialog.value = true;
};

const cerrarEditor = () => {
  dialog.value = false;
};

// Función para manejar el guardado
const guardar = () => {
    emit('guardar', {...formulario});
    cerrarEditor(); // Cerramos el diálogo después de guardar
};

// Observar cambios en la incidencia seleccionada para actualizar el formulario
watch(() => props.incidencia, (nuevaIncidencia) => {
  if (nuevaIncidencia) {
    formulario.id = nuevaIncidencia.id;
    formulario.titulo = nuevaIncidencia.titulo || '';
    formulario.descripcion = nuevaIncidencia.descripcion || '';
    formulario.urgencia = nuevaIncidencia.urgencia || '';
  }
}, { immediate: true });

const emit = defineEmits(['guardar']);
</script>

<template>
  <div>
    <!-- Botón que abre el v-dialog -->
    <v-btn density="compact" size="small"  @click="abrirEditor" 
      color="red" icon>
      <v-icon size="small">mdi-delete</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 bg-red text-white">
        Eliminar Incidencia #{{ formulario.id + ' - ' + formulario.titulo }}
      </v-card-title>
      
      <v-card-text>
        ¿Estas seguro de que quieres eliminar la incidencia?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="cerrarEditor">Cancelar</v-btn>
        <v-btn color="purple" @click="guardar">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<style>

</style>
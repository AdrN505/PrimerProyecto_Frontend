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

// Validación básica
const valido = ref(true);

// Función para abrir el diálogo
const abrirEditor = () => {
  dialog.value = true;
};

const cerrarEditor = () => {
  dialog.value = false;
};

// Función para manejar el guardado
const guardar = () => {
  if (valido.value) {
    // Emitir el formulario directamente, ya tiene el ID correcto del watcher
    emit('guardar', {...formulario});
    cerrarEditor(); // Cerramos el diálogo después de guardar
  }
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
      color="blue" icon>
      <v-icon size="small">mdi-pencil</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 bg-purple text-white">
        Editar Incidencia #{{ formulario.id }}
      </v-card-title>
      
      <v-card-text class="pt-4">
        <v-form v-model="valido" @submit.prevent="guardar">
          <v-text-field
            v-model="formulario.titulo"
            label="Título"
            :rules="REGLAS_VALIDACION.requerido"
            required
          ></v-text-field>
          
          <v-textarea
            v-model="formulario.descripcion"
            label="Descripción"
            :rules="REGLAS_VALIDACION.requerido"
            required
            rows="4"
          ></v-textarea>
          
          <v-select
            v-model="formulario.urgencia"
            :items="NIVELES_URGENCIA"
            label="Nivel de urgencia"
            :rules="REGLAS_VALIDACION.requerido"
            required
          ></v-select>
          <v-btn type="submit" style="display:none"></v-btn>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="cerrarEditor">Cancelar</v-btn>
        <v-btn color="purple" @click="guardar" :disabled="!valido">Guardar Cambios</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<style>
/*  <v-dialog :model-value="show" max-width="600px" @update:model-value="emit('update:show', $event)">
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
        <v-btn color="grey" text @click="cerrarEditor">Cancelar</v-btn>
        <v-btn color="purple" @click="guardar" :disabled="!valido">Guardar Cambios</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>*/
</style>
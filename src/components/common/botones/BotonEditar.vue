<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { NIVELES_URGENCIA, REGLAS_VALIDACION } from '@/config/constants';
import { incidenciasService } from '@/services/incidenciasService';

const props = defineProps({
  incidencia: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['incidenciaActualizada', 'operacionCompletada']);

// Estado para el diálogo
const dialogoVisible = ref(false);

// Estado para el formulario
const formulario = ref({
  titulo: '',
  descripcion: '',
  urgencia: ''
});

// Estado para el proceso de guardado
const guardando = ref(false);
const errorGuardado = ref(null);

// Cargar datos de la incidencia en el formulario cuando se abre el diálogo
watch(dialogoVisible, (visible) => {
  if (visible && props.incidencia) {
    // Cargar datos al abrir el diálogo
    formulario.value = {
      titulo: props.incidencia.titulo || '',
      descripcion: props.incidencia.descripcion || '',
      urgencia: props.incidencia.urgencia || NIVELES_URGENCIA[0]
    };
    
    console.log('Abriendo diálogo con urgencia:', formulario.value.urgencia);
    console.log('Valores de urgencia disponibles:', NIVELES_URGENCIA);
  }
});

// Validación del formulario
const formularioValido = ref(true);

// Función para abrir el diálogo
const abrirDialogo = () => {
  dialogoVisible.value = true;
};

// Exponer método para ser llamado desde el componente padre
defineExpose({ abrirDialogo });

// Función para cerrar el diálogo
const cerrarDialogo = () => {
  dialogoVisible.value = false;
  errorGuardado.value = null;
};

// Función para guardar los cambios
const guardarCambios = async () => {
  if (!formularioValido.value) return;
  
  guardando.value = true;
  errorGuardado.value = null;
  
  try {
    console.log('Valores del formulario antes de guardar:', {
      titulo: formulario.value.titulo,
      descripcion: formulario.value.descripcion,
      urgencia: formulario.value.urgencia
    });
    
    // Crear objeto con los datos actualizados
    const incidenciaActualizada = {
      ...props.incidencia,
      titulo: formulario.value.titulo,
      descripcion: formulario.value.descripcion,
      urgencia: formulario.value.urgencia
    };
    
    console.log('Enviando actualización con urgencia:', incidenciaActualizada.urgencia);
    
    // Llamar al servicio para actualizar la incidencia
    const resultado = await incidenciasService.actualizar(props.incidencia.id, incidenciaActualizada);
    console.log('Incidencia actualizada con éxito:', resultado);
    
    // Emitir evento para notificar que la incidencia ha sido actualizada
    emit('incidenciaActualizada', incidenciaActualizada);
    
    // Emitir evento para la alerta
    emit('operacionCompletada', {
      mensaje: `Incidencia #${props.incidencia.id} actualizada correctamente`,
      tipo: 'success'
    });
    
    // Cerrar el diálogo
    cerrarDialogo();
  } catch (error) {
    console.error('Error al actualizar la incidencia:', error);
    errorGuardado.value = 'No se pudo actualizar la incidencia';
  } finally {
    guardando.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Botón de edición -->
    <v-btn
      icon
      color="purple"
      variant="text"
      size="small"
      @click="abrirDialogo"
      class="edit-btn"
    >
      <v-icon>mdi-pencil</v-icon>
      <v-tooltip activator="parent" location="top">
        Editar incidencia
      </v-tooltip>
    </v-btn>
    
    <!-- Diálogo con formulario de edición -->
    <v-dialog
      v-model="dialogoVisible"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-toolbar color="purple" dark>
          <v-toolbar-title>
            Editar Incidencia #{{ incidencia.id }}
          </v-toolbar-title>
        </v-toolbar>
        
        <v-form
          v-model="formularioValido"
          @submit.prevent="guardarCambios"
        >
          <v-card-text class="pa-4">
            <!-- Mensaje de error -->
            <v-alert
              v-if="errorGuardado"
              type="error"
              class="mb-4"
              closable
            >
              {{ errorGuardado }}
            </v-alert>
            
            <!-- Campos para depuración -->
            <div v-if="false" class="mb-4 pa-3 border">
              <pre>Urgencia actual: {{ formulario.urgencia }}</pre>
              <pre>Urgencias disponibles: {{ NIVELES_URGENCIA }}</pre>
            </div>
            
            <!-- Campo de título -->
            <v-text-field
              v-model="formulario.titulo"
              label="Título"
              variant="outlined"
              :rules="REGLAS_VALIDACION.requerido"
              required
              class="mb-3"
            ></v-text-field>
            
            <!-- Campo de descripción -->
            <v-textarea
              v-model="formulario.descripcion"
              label="Descripción"
              variant="outlined"
              :rules="REGLAS_VALIDACION.requerido"
              required
              auto-grow
              rows="4"
              class="mb-3"
            ></v-textarea>
            
            <!-- Selector de urgencia -->
            <v-select
              v-model="formulario.urgencia"
              :items="NIVELES_URGENCIA"
              label="Nivel de urgencia"
              variant="outlined"
              :rules="REGLAS_VALIDACION.requerido"
              required
              @update:model-value="val => console.log('Urgencia seleccionada:', val)"
            ></v-select>
          </v-card-text>
          
          <v-divider></v-divider>
          
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="text"
              @click="cerrarDialogo"
              :disabled="guardando"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="purple"
              type="submit"
              :loading="guardando"
              :disabled="!formularioValido || guardando"
            >
              Guardar cambios
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.edit-btn {
  transition: transform 0.2s;
}

.edit-btn:hover {
  transform: scale(1.1);
}
</style>
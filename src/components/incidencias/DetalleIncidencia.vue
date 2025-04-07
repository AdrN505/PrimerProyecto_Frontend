<!-- Parte del script -->
<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue';
import { COLORES_URGENCIA } from '@/config/constants';
import BotonEditarIncidencia from '../common/botones/BotonEditarIncidencia.vue';
import BotonEliminarIncidencia from '../common/botones/BotonEliminarIncidencia.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  incidencia: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['update:show', 'editar', 'eliminar']);

// Estado local para controlar el diálogo
const dialogVisible = ref(props.show);

// Referencia al componente Editar
const editorRef = ref(null);

// Sincronizar el estado local con las props
watch(() => props.show, (newValue) => {
  dialogVisible.value = newValue;
});

// Emitir el evento cuando cambia el estado local
watch(dialogVisible, (newValue) => {
  emit('update:show', newValue);
});

// Función para cerrar el diálogo
const cerrarDialog = () => {
  dialogVisible.value = false;
};

const abrirEditor = () => {
  // Buscamos el botón dentro del componente hijo usando querySelector
  const botonEnComponente = document.querySelector('.editar-oculto .v-btn');
  if (botonEnComponente) {
    // Simulamos un clic en el botón encontrado
    botonEnComponente.click();
  }
};

const abrirEliminar = () => {
  // Buscamos el botón dentro del componente hijo usando querySelector
  const botonEnComponente = document.querySelector('.eliminar-oculto .v-btn');
  if (botonEnComponente) {
    // Simulamos un clic en el botón encontrado
    botonEnComponente.click();
  }
};

// Manejar la guardar edición
const guardarEdicion = (incidenciaActualizada) => {
  // Emitir el evento hacia arriba
  emit('editar', incidenciaActualizada);
  cerrarDialog();
};

// Manejar la eliminación
const guardarEliminacion = (incidenciaAEliminar) => {
  // Emitir el evento hacia arriba
  emit('eliminar', incidenciaAEliminar);
  cerrarDialog();
};

// Obtener el color según el nivel de urgencia
const colorUrgencia = computed(() => {
  if (!props.incidencia) return 'grey';
  return COLORES_URGENCIA[props.incidencia.urgencia?.toLowerCase()] || 'grey';
});

// Formatear la fecha de creación
const fechaCreacionFormateada = computed(() => {
  if (!props.incidencia || !props.incidencia.created_at) {
    return props.incidencia?.fechaCreacion || 'Fecha no disponible';
  }
  
  try {
    const fecha = new Date(props.incidencia.created_at);
    return fecha.toLocaleString();
  } catch (error) {
    return 'Fecha no disponible';
  }
});

// Formatear la fecha de actualización
const fechaActualizacionFormateada = computed(() => {
  if (!props.incidencia || !props.incidencia.updated_at) {
    return props.incidencia?.fechaActualizacion || 'Fecha no disponible';
  }
  
  try {
    const fecha = new Date(props.incidencia.updated_at);
    return fecha.toLocaleString();
  } catch (error) {
    return 'Fecha no disponible';
  }
});
</script>

<!-- Parte del template -->
<template>
  <v-dialog
    :model-value="dialogVisible"
    @update:model-value="dialogVisible = $event"
    max-width="600px"
  >
    <v-card v-if="incidencia">
      <v-toolbar :color="colorUrgencia" dark>
        <v-toolbar-title>
          <span class="text-h6">#{{ incidencia.id }} - {{ incidencia.titulo }}</span>
        </v-toolbar-title>
        <template v-slot:append>
          <!-- Componente Editar oculto pero accesible por referencia -->
          <div class="editar-oculto" style="display: none;">
            <BotonEditarIncidencia
              ref="editorRef"
              :incidencia="incidencia"
              @guardar="guardarEdicion"
            ></BotonEditarIncidencia>
          </div>
          
          <!-- Componente Eliminar oculto -->
          <div class="eliminar-oculto" style="display: none;">
            <BotonEliminarIncidencia
              :incidencia="incidencia"
              @guardar="guardarEliminacion"
              @click.stop
            ></BotonEliminarIncidencia>
          </div>
        </template>
      </v-toolbar>
      
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-1 font-weight-bold mb-2">Descripción:</div>
            <div class="text-body-1 mb-4">{{ incidencia.descripcion }}</div>
            
            <v-divider class="mb-4"></v-divider>
            
            <div class="d-flex align-center mb-2">
              <div class="text-subtitle-1 font-weight-bold mr-2">Nivel de urgencia:</div>
              <v-chip :color="colorUrgencia" label size="small">
                {{ incidencia.urgencia }}
              </v-chip>
            </div>
            
            <div class="text-subtitle-2 mb-1">
              <v-icon size="small" class="mr-1">mdi-calendar-plus</v-icon>
              Creada: {{ fechaCreacionFormateada }}
            </div>
            
            <div class="text-subtitle-2 mb-3">
              <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
              Actualizada: {{ fechaActualizacionFormateada }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="blue" @click="abrirEditor" class="mr-2">
          <v-icon left>mdi-pencil</v-icon>
          Editar
        </v-btn>
        
        <v-btn color="red" @click="abrirEliminar" class="mr-2">
          <v-icon left>mdi-delete</v-icon>
          Eliminar
        </v-btn>

        <v-btn color="grey" variant="text" @click="cerrarDialog">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-text {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
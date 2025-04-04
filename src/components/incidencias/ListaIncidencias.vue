<script setup>
import { ref, onMounted } from 'vue';
import { incidenciasService } from '@/services/incidenciasService';
import { COLORES_URGENCIA } from '@/config/constants';
import usePaginacion from '@/composables/usePaginacion';
import DetalleIncidencia from './DetalleIncidencia.vue';

// Estado para almacenar las incidencias
const todasLasIncidencias = ref([]);
const cargando = ref(false);
const error = ref(null);

// Estado para el diálogo de detalle
const dialogoDetalle = ref(false);
const incidenciaSeleccionada = ref(null);

// Usar el composable de paginación
const { 
  paginaActual,
  itemsPerPage,
  opcionesPaginas,
  totalPaginas,
  itemsPaginados: incidenciasPaginadas,
  cambiarItemsPorPagina
} = usePaginacion(todasLasIncidencias);

// Función para obtener las incidencias
const obtenerIncidencias = async () => {
  cargando.value = true;
  error.value = null;
  
  try {
    todasLasIncidencias.value = await incidenciasService.obtenerTodas();
  } catch (err) {
    console.error('Error al obtener incidencias:', err);
    error.value = 'No se pudieron cargar las incidencias';
  } finally {
    cargando.value = false;
  }
};

// Función para determinar el color según el nivel de urgencia
const getUrgenciaColor = (urgencia) => {
  return COLORES_URGENCIA[urgencia?.toLowerCase()] || 'grey';
};

// Función para mostrar el detalle de la incidencia
const verDetalle = (incidencia) => {
  incidenciaSeleccionada.value = incidencia;
  dialogoDetalle.value = true;
};

// Obtener incidencias al montar el componente
onMounted(obtenerIncidencias);

// Exponer el método para que pueda ser llamado desde fuera
defineExpose({
  obtenerIncidencias
});
</script>

<template>
  <v-container full-width>
    <fieldset>
      <legend>Visualización de Incidencias</legend>
      
      <!-- Controles de actualización -->
      <div class="d-flex justify-space-between align-center mb-4">
        <v-btn 
          color="purple" 
          class="refresh-btn" 
          @click="obtenerIncidencias" 
          :loading="cargando"
          :disabled="cargando"
        >
          <v-icon class="mr-2">mdi-refresh</v-icon>
          Actualizar
        </v-btn>
        
        <v-select
          v-model="itemsPerPage"
          :items="opcionesPaginas"
          label="Items por página"
          variant="outlined"
          density="compact"
          hide-details
          class="items-per-page-select"
          style="max-width: 150px"
          @update:model-value="cambiarItemsPorPagina"
        ></v-select>
      </div>
      
      <!-- Indicador de carga -->
      <div v-if="cargando" class="d-flex justify-center my-8">
        <v-progress-circular indeterminate color="purple" size="64"></v-progress-circular>
      </div>
      
      <!-- Mensaje de error -->
      <v-alert v-else-if="error" type="error" class="mb-4">
        {{ error }}
        <template v-slot:append>
          <v-btn variant="text" @click="obtenerIncidencias">Reintentar</v-btn>
        </template>
      </v-alert>
      
      <!-- Mensaje de lista vacía -->
      <v-alert v-else-if="todasLasIncidencias.length === 0" type="info" class="mb-4">
        No hay incidencias registradas
      </v-alert>
      
      <!-- Lista de incidencias -->
      <template v-else>
        <v-list class="incidencias-list rounded">
          <v-list-item 
            v-for="incidencia in incidenciasPaginadas" 
            :key="incidencia.id" 
            :value="incidencia.id" 
            rounded 
            class="mb-2 incidencia-item"
            @click="verDetalle(incidencia)"
          >
            <v-list-item-title class="d-flex align-center">
              <span class="font-weight-bold mr-2">#{{ incidencia.id }}</span>
              <span>{{ incidencia.titulo }}</span>
            </v-list-item-title>
            
            <template v-slot:subtitle>
              <div class="text-truncate">{{ incidencia.descripcion }}</div>
              <div class="mt-1">
                <v-icon size="small" color="grey" class="mr-1">mdi-calendar</v-icon>
                <span class="text-caption">{{ incidencia.fechaCreacion }}</span>
              </div>
            </template>
            
            <template v-slot:append>
              <v-chip 
                :color="getUrgenciaColor(incidencia.urgencia)" 
                class="urgencia-chip"
                size="small"
                label
              >
                {{ incidencia.urgencia }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
        
        <!-- Paginación -->
        <div class="d-flex justify-center mt-4">
          <v-pagination
            v-model="paginaActual"
            :length="totalPaginas"
            :total-visible="5"
            rounded
            color="purple"
          ></v-pagination>
        </div>
        
        <!-- Información de paginación -->
        <div class="text-caption text-center mt-2">
          Mostrando {{ incidenciasPaginadas.length }} de {{ todasLasIncidencias.length }} incidencias
        </div>
      </template>
      
      <!-- Componente de detalle -->
      <DetalleIncidencia 
        :show="dialogoDetalle"
        @update:show="dialogoDetalle = $event"
        :incidencia="incidenciaSeleccionada"
      />
    </fieldset>
  </v-container>
</template>

<style scoped>
legend {
  padding: 0 10px; 
  font-weight: bold; 
  color: white;
  background-color: purple;
  border-radius: 20px;
}

fieldset {
  margin: 10px; 
  border-radius: 20px; 
  padding: 20px; 
  border: 1px solid purple;
}

.incidencia-item {
  transition: all 0.2s;
  border-left: 4px solid transparent;
  cursor: pointer;
}

.incidencia-item:hover {
  background-color: #f5f5f5;
  border-left-color: #9c27b0;
}

.urgencia-chip {
  min-width: 80px;
  text-align: center;
}

.items-per-page-select {
  width: 120px;
}
</style>
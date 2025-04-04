<script setup>
// El script se mantiene igual
import { ref, onMounted } from 'vue';
import { incidenciasService } from '@/services/incidenciasService';
import { COLORES_URGENCIA } from '@/config/constants';
import usePaginacion from '@/composables/usePaginacion';
import DetalleIncidencia from './DetalleIncidencia.vue';
import Editar from '@/components/common/botones/Editar.vue'

const todasLasIncidencias = ref([]);
const cargando = ref(false);
const error = ref(null);
const dialogoDetalle = ref(false);
const incidenciaSeleccionada = ref(null);
const displayMobile = ref(false); // Nueva ref para detectar pantallas móviles

const { 
  paginaActual,
  itemsPerPage,
  opcionesPaginas,
  totalPaginas,
  itemsPaginados: incidenciasPaginadas,
  cambiarItemsPorPagina
} = usePaginacion(todasLasIncidencias);

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

const getUrgenciaColor = (urgencia) => {
  return COLORES_URGENCIA[urgencia?.toLowerCase()] || 'grey';
};

const verDetalle = (incidencia) => {
  incidenciaSeleccionada.value = incidencia;
  dialogoDetalle.value = true;
};

// Función para detectar si es una pantalla móvil
const checkMobileDisplay = () => {
  displayMobile.value = window.innerWidth < 600;
};

onMounted(() => {
  obtenerIncidencias();
  checkMobileDisplay();
  window.addEventListener('resize', checkMobileDisplay);
});

defineExpose({
  obtenerIncidencias
});
</script>

<template>
  <v-container :class="{'pa-0': displayMobile}">
    <fieldset>
      <legend>Visualización de Incidencias</legend>
      
      <!-- Controles de actualización -->
      <div :class="{'d-flex justify-space-between align-center mb-4': !displayMobile, 
                    'mb-4': displayMobile}">
        <v-btn 
          color="purple" 
          class="refresh-btn" 
          @click="obtenerIncidencias" 
          :loading="cargando"
          :disabled="cargando"
          :block="displayMobile"
          :class="{'mb-2': displayMobile}"
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
          :style="!displayMobile ? 'max-width: 150px' : 'width: 100%'"
          @update:model-value="cambiarItemsPorPagina"
        ></v-select>
      </div>
      
      <!--Circulo de carga lista-->
      <div v-if="cargando" class="d-flex justify-center my-8">
        <v-progress-circular indeterminate color="purple" size="64"></v-progress-circular>
      </div>

      <!--Mensajes Lista-->
      <v-alert v-else-if="error" type="error" class="mb-4">
        {{ error }}
        <template v-slot:append>
          <v-btn variant="text" @click="obtenerIncidencias">Reintentar</v-btn>
        </template>
      </v-alert>
      
      <v-alert v-else-if="todasLasIncidencias.length === 0" type="info" class="mb-4">
        No hay incidencias registradas
      </v-alert>
      
      <template v-else>
        <v-list class="incidencias-list rounded">
          <v-list-item 
            v-for="incidencia in incidenciasPaginadas" 
            :key="incidencia.id" 
            :value="incidencia.id" 
            rounded 
            class="mb-2 incidencia-item"
            @click="verDetalle(incidencia)"
            :class="{'mobile-item': displayMobile}"
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
                class="mr-2"
                size="small"
                label
              >
                {{ incidencia.urgencia }}
              </v-chip>
              <Editar></Editar>
            </template>
          </v-list-item>
        </v-list>
        
        <div class="d-flex justify-center mt-4">
          <v-pagination
            v-model="paginaActual"
            :length="totalPaginas"
            :total-visible="displayMobile ? 3 : 5"
            rounded
            color="purple"
          ></v-pagination>
        </div>
        
        <div class="text-caption text-center mt-2">
          Mostrando {{ incidenciasPaginadas.length }} de {{ todasLasIncidencias.length }} incidencias
        </div>
      </template>
      
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

@media (max-width: 600px) {
  fieldset {
    margin: 1px;
    padding: 5px;
    border-radius: 0;
  }
  
  .mobile-item {
    padding: 8px;
  }
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

.items-per-page-select {
  width: 120px;
}
</style>
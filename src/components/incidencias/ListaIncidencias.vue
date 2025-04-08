<!--components/incidencias/ListaIncidencias.vue (Optimizado)-->

<script setup>
import { ref, onMounted } from 'vue';
import useIncidencias from '@/composables/useIncidencias';
import usePaginacion from '@/composables/usePaginacion';
import useResponsive from '@/composables/useResponsive';
import DetalleIncidencia from './DetalleIncidencia.vue';
import BuscadorIncidencia from './BuscadorIncidencia.vue';
import ItemIncidencia from './ItemIncidencia.vue';
import Alerta from '@/components/common/Alerta.vue';

// Composables
const { isMobile } = useResponsive();
const { 
  incidencias, 
  incidenciasFiltradas, 
  cargando, 
  error, 
  alerta, 
  obtenerIncidencias, 
  editarIncidencia, 
  eliminarIncidencia, 
  aplicarFiltros 
} = useIncidencias();

const { 
  paginaActual,
  itemsPerPage,
  opcionesPaginas,
  totalPaginas,
  itemsPaginados: incidenciasPaginadas,
  cambiarItemsPorPagina
} = usePaginacion(incidenciasFiltradas);

// State local
const dialogoDetalle = ref(false);
const incidenciaSeleccionada = ref(null);

// Métodos
const verDetalle = (incidencia) => {
  incidenciaSeleccionada.value = incidencia;
  dialogoDetalle.value = true;
};

onMounted(obtenerIncidencias);

defineExpose({
  obtenerIncidencias
});
</script>

<template>
  <v-container :class="{'pa-0': isMobile}">
    <fieldset>
      <legend>Visualización de Incidencias</legend>
      
      <!-- Alerta global -->
      <Alerta
        :visible="alerta.visible"
        :mensaje="alerta.mensaje"
        :tipo="alerta.tipo"
        @update:visible="alerta.visible = $event"
      />

      <!-- Controles de actualización -->
      <div :class="{'d-flex justify-space-between align-center mb-4': !isMobile, 
                    'mb-4': isMobile}">
        <v-btn 
          color="purple" 
          class="refresh-btn" 
          @click="obtenerIncidencias" 
          :loading="cargando"
          :disabled="cargando"
          :block="isMobile"
          :class="{'mb-2': isMobile}"
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
          :style="!isMobile ? 'max-width: 150px' : 'width: 100%'"
          @update:model-value="cambiarItemsPorPagina"
        ></v-select>
      </div>
      
      <!-- Buscador de incidencias -->
      <BuscadorIncidencia
        :incidencias="incidencias" 
        @filtrar-resultados="aplicarFiltros" 
      />

      <!-- Estados: cargando, error, sin datos -->
      <div v-if="cargando" class="d-flex justify-center my-8">
        <v-progress-circular indeterminate color="purple" size="64"></v-progress-circular>
      </div>

      <v-alert v-else-if="error" type="error" class="mb-4">
        {{ error }}
        <template v-slot:append>
          <v-btn variant="text" @click="obtenerIncidencias">Reintentar</v-btn>
        </template>
      </v-alert>
      
      <v-alert v-else-if="incidencias.length === 0" type="info" class="mb-4">
        No hay incidencias registradas
      </v-alert>
      
      <!-- Lista de incidencias -->
      <template v-else>
        <v-list class="incidencias-list rounded">
          <ItemIncidencia
            v-for="incidencia in incidenciasPaginadas" 
            :key="incidencia.id"
            :incidencia="incidencia"
            :isMobile="isMobile"
            @ver-detalle="verDetalle"
            @editar="editarIncidencia"
            @eliminar="eliminarIncidencia"
          />
        </v-list>
        
        <!-- Paginación -->
        <div class="d-flex justify-center mt-4">
          <v-pagination
            v-model="paginaActual"
            :length="totalPaginas"
            :total-visible="isMobile ? 3 : 5"
            rounded
            color="purple"
          ></v-pagination>
        </div>
        
        <!-- Información de paginación -->
        <div class="text-caption text-center mt-2">
          Mostrando {{ incidenciasPaginadas.length }} de {{ incidenciasFiltradas.length }} incidencias
          <template v-if="incidenciasFiltradas.length !== incidencias.length">
            (filtradas de {{ incidencias.length }} totales)
          </template>
        </div>
      </template>
      
      <!-- Diálogo de detalle -->
      <DetalleIncidencia 
        :show="dialogoDetalle"
        @update:show="dialogoDetalle = $event"
        :incidencia="incidenciaSeleccionada"
        @editar="editarIncidencia"
        @eliminar="eliminarIncidencia"
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
}

.items-per-page-select {
  width: 120px;
}
</style>
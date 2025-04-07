<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  incidencias: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['filtrar-resultados']);

// Referencias reactivas para los filtros
const terminoBusqueda = ref('');
const filtroUrgencia = ref([]);
const displayMobile = ref(false);

// Lista de niveles de urgencia disponibles (extraídos de las incidencias)
const nivelesUrgencia = computed(() => {
  const niveles = new Set();
  props.incidencias.forEach(incidencia => {
    if (incidencia.urgencia) {
      niveles.add(incidencia.urgencia);
    }
  });
  return Array.from(niveles);
});

// Lógica de filtrado
const filtrarIncidencias = () => {
  let resultados = [...props.incidencias];
  
  // Filtrar por término de búsqueda (título o ID)
  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.trim().toLowerCase();
    
    resultados = resultados.filter(incidencia => 
      (incidencia.titulo && incidencia.titulo.toLowerCase().includes(termino)) || 
      (incidencia.id && incidencia.id.toString().includes(termino))
    );
  }
  
  // Filtrar por urgencia
  if (filtroUrgencia.value.length > 0) {
    resultados = resultados.filter(incidencia => 
      incidencia.urgencia && filtroUrgencia.value.includes(incidencia.urgencia)
    );
  }
  
  // Emitir los resultados filtrados al componente padre
  emit('filtrar-resultados', resultados);
};

// Detectar cambios en los filtros y actualizar resultados
watch([terminoBusqueda, filtroUrgencia], () => {
  filtrarIncidencias();
}, { deep: true });

// Función para limpiar todos los filtros
const limpiarFiltros = () => {
  terminoBusqueda.value = '';
  filtroUrgencia.value = [];
  filtrarIncidencias();
};

// Función para detectar si es una pantalla móvil
const checkMobileDisplay = () => {
  displayMobile.value = window.innerWidth < 600;
};

// Inicializar la detección de móvil al montar el componente
onMounted(() => {
  checkMobileDisplay();
  window.addEventListener('resize', checkMobileDisplay);
  // Aplicar filtro inicial para asegurar que se aplica cualquier valor predeterminado
  filtrarIncidencias();
});

// Limpieza al desmontar el componente
onUnmounted(() => {
  window.removeEventListener('resize', checkMobileDisplay);
});
</script>

<template>
  <v-container :class="{'pa-0': displayMobile}" class="busqueda-container">
    <div class="d-flex align-center mb-3">
      <v-icon color="purple" class="mr-2">mdi-filter-variant</v-icon>
      <span class="text-h6 font-weight-medium purple--text">Buscar y Filtrar Incidencias</span>
    </div>
    
    <v-row dense>
      <!-- Búsqueda por título o ID -->
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="terminoBusqueda"
          label="Buscar por título o ID"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          class="mb-2"
        ></v-text-field>
      </v-col>
      
      <!-- Filtro por nivel de urgencia -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="filtroUrgencia"
          :items="nivelesUrgencia"
          label="Filtrar por urgencia"
          variant="outlined"
          density="comfortable"
          multiple
          chips
          closable-chips
          hide-details
          class="mb-2"
        ></v-select>
      </v-col>
      
      <!-- Botón para limpiar filtros -->
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          color="purple"
          variant="outlined"
          @click="limpiarFiltros"
          :block="displayMobile"
          prepend-icon="mdi-filter-remove"
        >
          Limpiar filtros
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- Indicador de filtros activos -->
    <v-row v-if="terminoBusqueda || filtroUrgencia.length">
      <v-col cols="12">
        <v-chip-group>
          <v-chip
            v-if="terminoBusqueda"
            color="purple"
            closable
            @click:close="terminoBusqueda = ''"
          >
            Búsqueda: {{ terminoBusqueda }}
          </v-chip>
          
          <v-chip
            v-for="urgencia in filtroUrgencia"
            :key="urgencia"
            color="purple"
            closable
            @click:close="filtroUrgencia = filtroUrgencia.filter(u => u !== urgencia)"
          >
            Urgencia: {{ urgencia }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.busqueda-container {
  border-radius: 8px; 
  padding: 16px;
  background-color: rgba(158, 39, 176, 0.05);
  margin-bottom: 20px;
}

.w-100 {
  width: 100%;
}

@media (max-width: 600px) {
  .busqueda-container {
    padding: 10px;
    border-radius: 4px;
  }
}
</style>
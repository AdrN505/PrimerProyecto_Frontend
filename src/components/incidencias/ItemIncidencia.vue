<!--components/incidencias/ItemIncidencia.vue-->

<script setup>
import { COLORES_URGENCIA } from '@/config/constants';
import BotonEditarIncidencia from '../common/botones/BotonEditarIncidencia.vue';
import BotonEliminarIncidencia from '../common/botones/BotonEliminarIncidencia.vue';

defineProps({
  incidencia: {
    type: Object,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['ver-detalle', 'editar', 'eliminar']);

const getUrgenciaColor = (urgencia) => {
  return COLORES_URGENCIA[urgencia?.toLowerCase()] || 'grey';
};

const verDetalle = (incidencia) => {
  emit('ver-detalle', incidencia);
};

const guardarEdicion = (incidenciaActualizada) => {
  emit('editar', incidenciaActualizada);
};

const guardarEliminacion = (incidencia) => {
  emit('eliminar', incidencia);
};
</script>

<template>
  <v-list-item 
    :value="incidencia.id" 
    rounded 
    class="mb-2 incidencia-item"
    @click="verDetalle(incidencia)"
    :class="{'mobile-item': isMobile}"
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
      <BotonEditarIncidencia
        :incidencia="incidencia"
        @guardar="guardarEdicion"
        @click.stop
      ></BotonEditarIncidencia>
      <BotonEliminarIncidencia
        :incidencia="incidencia"
        @guardar="guardarEliminacion"
        @click.stop
        class="ml-2"
      ></BotonEliminarIncidencia>
    </template>
  </v-list-item>
</template>

<style scoped>
.incidencia-item {
  transition: all 0.2s;
  border-left: 4px solid transparent;
  cursor: pointer;
}

.incidencia-item:hover {
  background-color: #f5f5f5;
  border-left-color: #9c27b0;
}

.mobile-item {
  padding: 8px;
}
</style>
<script setup>
import { ref } from 'vue';
import Formulario from './components/Formulario.vue';
import Incidencias from './components/Incidencias.vue'
import FormularioIncidencia from './components/incidencias/FormularioIncidencia.vue';

// Usamos ref para hacer referencia al componente Incidencias
const incidenciasRef = ref(null);

// Función para manejar el evento cuando se crea una nueva incidencia
const handleIncidenciaCreada = () => {
  // Llamamos a la función obtenerIncidencias desde el componente Incidencias
  if (incidenciasRef.value) {
    incidenciasRef.value.obtenerIncidencias();
  }
};


/*
    <v-app>
        <v-container full-width>
            <!-- Título -->
            <v-toolbar color="purple" full-width>
                <v-toolbar-title class="text-h4 text-center">Incidencias</v-toolbar-title>
            </v-toolbar>
                <Formulario @incidencia-creada="handleIncidenciaCreada"/>
                <Incidencias ref="incidenciasRef"/>
        </v-container>
    </v-app>
*/ 
</script>

<template>
  <FormularioIncidencia></FormularioIncidencia>
</template>

<style scoped>

</style>
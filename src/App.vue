<script setup>
import FormularioIncidencia from './components/incidencias/FormularioIncidencia.vue';
import ListaIncidencias from './components/incidencias/ListaIncidencias.vue';
import '@mdi/font/css/materialdesignicons.css'

</script>

<template>
    <!-- Título -->
    <v-toolbar color="purple" full-width>
      <v-toolbar-title class="text-h4 text-center">Incidencias</v-toolbar-title>
  </v-toolbar>
    <FormularioIncidencia></FormularioIncidencia>
    <ListaIncidencias></ListaIncidencias>
</template>

<style scoped>

</style>
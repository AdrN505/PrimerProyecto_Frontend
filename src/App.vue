<script setup>
import Formulario from './components/Formulario.vue';
import Incidencias from './components/Incidencias.vue'

</script>

<template>
    <v-app>
        <v-container full-width>
            <!-- Título -->
            <v-toolbar color="purple" full-width>
                <v-toolbar-title class="text-h4 text-center">Incidencias</v-toolbar-title>
            </v-toolbar>
                <Formulario/>
                <Incidencias/>
        </v-container>
    </v-app>
</template>

<style scoped>

</style>
<!-- components/incidencias/FormularioIncidencia.vue -->

<script setup>
import { reactive, ref } from 'vue';
import { incidenciasService } from '@/services/incidenciasService';
import { NIVELES_URGENCIA, REGLAS_VALIDACION } from '@/config/constants';
import { useAlerta } from '@/composables/useAlerta';
import Alerta from '@/components/common/Alerta.vue';

// Estado del formulario
const incidencia = reactive({
  titulo: '',
  descripcion: '',
  urgencia: ''
});

// Validación
const formularioValido = ref(true);
const reglas = REGLAS_VALIDACION;

// Usando el composable de alerta
const { alerta, mostrarAlerta } = useAlerta();

// Estado de carga para el botón
const enviando = ref(false);

// Enviar formulario
const submitForm = async () => {
  // Evitar envíos duplicados mientras está en proceso
  if (enviando.value) return;
  
  try {
    enviando.value = true; // Bloquear el botón
    
    const data = await incidenciasService.crear(incidencia);
    
    // Mostrar mensaje de éxito usando el composable
    mostrarAlerta('Incidencia creada con éxito: ' + data.incidencia.titulo, 'success');
    
    // Limpiar el formulario
    incidencia.titulo = '';
    incidencia.descripcion = '';
    incidencia.urgencia = '';
    
  } catch (error) {
    console.error('Error:', error);
    mostrarAlerta('Error al crear la incidencia', 'error');
  } finally {
    // Desbloquear el botón una vez completada la operación, sea exitosa o no
    enviando.value = false;
  }
};
</script>

<template>
  <v-container full-width>
    <fieldset>
      <legend>Generar Incidencia</legend>
      
      <!-- Usando el componente de alerta global -->
      <Alerta
        :visible="alerta.visible"
        :mensaje="alerta.mensaje"
        :tipo="alerta.tipo"
        @update:visible="alerta.visible = $event"
      />
      
      <v-form v-model="formularioValido" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="incidencia.titulo"
              label="Título de Incidencia"
              :rules="reglas.requerido"
              required
              variant="outlined"
              comfortable
              color="purple"
              :disabled="enviando"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-text-field
              v-model="incidencia.descripcion"
              label="Descripcion de Incidencia"
              :rules="reglas.requerido"
              required
              variant="outlined"
              comfortable
              color="purple"
              :disabled="enviando"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-select
              v-model="incidencia.urgencia"
              :items="NIVELES_URGENCIA"
              label="Nivel de Urgencia"
              :rules="reglas.requerido"
              required
              variant="outlined"
              comfortable
              color="purple"
              :disabled="enviando"
            ></v-select>
          </v-col>
        </v-row>
        
        <v-row justify="center">
          <v-btn
            color="purple"
            type="submit"
            class="mt-3"
            :disabled="!formularioValido || enviando"
            :loading="enviando"
          >
            {{ enviando ? 'Enviando...' : 'Enviar' }}
          </v-btn>
        </v-row>
      </v-form>
    </fieldset>
  </v-container>
</template>

<style scoped>
legend{
  padding: 0 10px; 
  font-weight: bold; 
  color: white;
  background-color:purple;
  border-radius: 20px
}
fieldset{
  margin: 10px; 
  border-radius: 20px; 
  padding: 20px; 
  border: 1px solid purple;
}
</style>
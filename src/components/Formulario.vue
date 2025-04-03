<script setup>
  import { reactive, computed } from 'vue';

  const incidencia = reactive({
      id: '',
      titulo: '',
      descripcion: '',
      urgencia: ''
  });

  const urgencias = ['Baja', 'Media', 'Alta', 'Muy Alta'];

  const submitForm = async () => {
    try {
        const response = await fetch('http://localhost:8000/incidencias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incidencia),
        });

        if (!response.ok) {
            throw new Error('Error al enviar la incidencia');
        }

        const data = await response.json();
        console.log('Incidencia enviada:', data);
        alert('Incidencia creada con éxito: ' + data.incidencia.titulo);

        // Limpiar el formulario después del envío
        incidencia.id = '';
        incidencia.titulo = '';
        incidencia.descripcion = '';
        incidencia.urgencia = '';

    } catch (error) {
        console.error('Error:', error);
    }
  };
</script>

<template>
    <v-container full-width>
      <!-- Título de sección Crear -->
      <fieldset style="">
        <legend>Generar Incidencia</legend>
        
        <v-form @submit.prevent="submitForm">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="incidencia.titulo"
                label="Título de Incidencia"
                required
                variant="outlined"
                comfortable
                color="purple"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="incidencia.descripcion"
                label="Descripcion de Incidencia"
                required
                variant="outlined"
                comfortable
                color="purple"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-select
                v-model="incidencia.urgencia"
                :items="urgencias"
                label="Nivel de Urgencia"
                required
                variant="outlined"
                comfortable
                color="purple"
              ></v-select>
            </v-col>
          </v-row>
          
          <v-row justify="center">
            <v-btn
              color="purple"
              type="submit"
              class="mt-3"
            >Enviar</v-btn>
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
    background-color:purple ;
    border-radius: 20px
  }
  fieldset{
    margin: 10px; 
    border-radius: 20px; 
    padding: 20px; 
    border: 1px solid purple;
  }
</style>

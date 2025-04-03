<script setup>

    import { ref, reactive , computed } from 'vue'

    const incidencia = reactive({
        id: '',
        titulo: '',
        descripcion: '',
        urgencia: ''
    })

    const urgencias = ['Baja', 'Media', 'Alta', 'Muy Alta']

    const isFormValid = computed(() => {
        return incidencia.titulo && incidencia.descripcion && incidencia.urgencia
    })

    const submitForm = async () => {
        if (isFormValid.value) {
            try {
                // Enviar la incidencia al servidor usando fetch
                const response = await fetch('http://localhost:8000/incidencias', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(incidencia),
                })

                if (!response.ok) {
                    throw new Error('Error al enviar la incidencia')
                }

                const data = await response.json()
                console.log('Incidencia enviada:', data)
            } catch (error) {
            console.error('Error:', error)
            }  
        } else {
            console.log('Por favor, rellene todos los campos.')
        }
    }
</script>

<template>
<v-app>
    <v-container full-width>
      <!-- Título -->
      <v-toolbar color="purple" full-width>
        <v-toolbar-title class="text-h4 text-center">Incidencias</v-toolbar-title>
      </v-toolbar>

      <!-- Título de sección Crear -->
      <fieldset style="">
        <legend>Generar Incidencia</legend>
        
        <v-form @submit.prevent="submitForm">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="incidencia.id"
                label="Título de Incidencia"
                required
                variant="outlined"
                comfortable
                color="purple"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="incidencia.titulo"
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
      
      <!-- Espacio para la segunda sección -->
      <fieldset>
        <legend>Visualizacion de incidencias</legend>
        <v-btn
        color="purple"
        type="submit"
        class="mt-3"
        >Mostrar Incidencias</v-btn>

        <v-row>
          <v-col>
            
          </v-col>
        </v-row>
      </fieldset>
    </v-container>
  </v-app>
</template>

<style>
legend{
  padding: 0 10px; 
  font-weight: bold; 
  color: white !important;
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

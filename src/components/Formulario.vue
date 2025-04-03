<script setup>
  import { ref, reactive, defineEmits } from 'vue';

  const emit = defineEmits();

  const incidencia = reactive({
      id: '',
      titulo: '',
      descripcion: '',
      urgencia: ''
  });

  const urgencias = ['Baja', 'Media', 'Alta', 'Muy Alta'];

  // Estados para la alerta
    const alertaVisible = ref(false);
    const mensajeAlerta = ref('');

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
        mensajeAlerta.value = 'Incidencia creada con éxito: ' + data.incidencia.titulo;
        alertaVisible.value = true;
        
        // Emitir el evento a App.vue para que actualice las incidencias
        emit('incidencia-creada');
    
        // Hacer que la alerta desaparezca después de 3 segundos
        setTimeout(() => {
            alertaVisible.value = false;
        }, 3000);

        // Limpiar el formulario después del envío
        incidencia.id = '';
        incidencia.titulo = '';
        incidencia.descripcion = '';
        incidencia.urgencia = '';

    } catch (error) {
        console.error('Error:', error);
    }
  };

// Validación básica
    const formularioValido = ref(true);
    const reglas = {
      requerido: [v => !!v || 'Este campo es requerido']
    };
</script>

<template>
    <v-container full-width>
      <!-- Título de sección Crear -->
      <fieldset style="">
        <legend>Generar Incidencia</legend>
        
          <!-- Alerta temporal que aparece después de enviar el formulario -->
          <v-alert
            v-if="alertaVisible"
            type="success"
            closable
            transition="scale-transition"
            class="mb-4"
          >
            {{ mensajeAlerta }}
          </v-alert>
        <v-form v-model="formularioValido" @submit.prevent="submitForm" >
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
                      ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="4">
                      <v-select
                          v-model="incidencia.urgencia"
                          :items="urgencias"
                          label="Nivel de Urgencia"
                          :rules="reglas.requerido"
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
                      :disabled="!formularioValido"
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

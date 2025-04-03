<script setup>
import { ref } from 'vue';
import DetalleIncidencia from './incidencias/DetalleIncidencia.vue'
import EdicionIncidencia from './incidencias/EdicionIncidencia.vue';
import '@mdi/font/css/materialdesignicons.css'


// Estado para almacenar las incidencias
const incidencias = ref([]);
// Estado para los diálogos
const dialogoDetalle = ref(false);
const dialogoEdicion = ref(false);
const dialogoEliminar = ref(false);
// Estado para las incidencias seleccionadas
const incidenciaSeleccionada = ref(null);
const incidenciaEditando = ref(null);
const idIncidenciaEliminar = ref(null);

// Alerta para mostrar mensajes
const alerta = ref({
  visible: false,
  texto: '',
  tipo: 'success'
});

// Función para mostrar una alerta
const mostrarAlerta = (texto, tipo = 'success') => {
  alerta.value = {
    visible: true,
    texto,
    tipo
  };
  setTimeout(() => {
    alerta.value.visible = false;
  }, 3000);
};

//Mapa de colores de urgencias
const coloresUrgencia = {
  'muy alta': 'red-darken-4',
  'alta': 'red',
  'media': 'amber',
  'baja': 'green'
};

// Función para obtener las incidencias
const obtenerIncidencias = async () => {
  try {
    const response = await fetch('http://localhost:8000/incidencias');

    if (!response.ok) 
      throw new Error(`Error de red: ${response.status}`);
    
      incidencias.value = await response.json();

  } catch (err) {
    console.error('Error al obtener incidencias:', err);
  }
};
// Función para determinar el color según el nivel de urgencia
const getUrgenciaColor = (urgencia) => 
  coloresUrgencia[urgencia?.toLowerCase()] || 'grey';

// Función para mostrar el detalle de la incidencia
const mostrarDetalle = (incidencia) => {
  incidenciaSeleccionada.value = incidencia;
  dialogoDetalle.value = true;
};

// Función para abrir el diálogo de confirmación de eliminación
const confirmarEliminar = (id) => {
  idIncidenciaEliminar.value = id;
  dialogoEliminar.value = true;
};

// Función para abrir el diálogo de edición
const editarIncidencia = (id) => {
  // Buscar la incidencia por ID
  const incidencia = incidencias.value.find(inc => inc.id === id);
  if (incidencia) {
    incidenciaEditando.value = incidencia;
    dialogoEdicion.value = true;
  }
};

// Función para guardar los cambios de la edición
const guardarEdicion = async (datosEditados) => {
  try {
    
    const response = await fetch(`http://localhost:8000/incidencias/${incidenciaEditando.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosEditados),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar: ${response.status}`);
    }

    const incidenciaActualizada = await response.json();
    
    // Actualizar la incidencia en el array local
    const index = incidencias.value.findIndex(inc => inc.id === incidenciaActualizada.id);
    if (index !== -1) {
      incidencias.value[index] = incidenciaActualizada;
    }
    
    dialogoEdicion.value = false;
    dialogoDetalle.value = false;
    mostrarAlerta('Incidencia actualizada correctamente');
  } catch (err) {
    console.error('Error al actualizar la incidencia:', err);
    mostrarAlerta('Error al actualizar la incidencia', 'error');
  }
};

// Función para eliminar la incidencia
const eliminarIncidencia = async () => {
  try {
    const response = await fetch(`http://localhost:8000/incidencias/${idIncidenciaEliminar.value}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar: ${response.status}`);
    }

    // Eliminar la incidencia del array local
    incidencias.value = incidencias.value.filter(inc => inc.id !== idIncidenciaEliminar.value);
    
    dialogoEliminar.value = false;
    dialogoDetalle.value = false;
    mostrarAlerta('Incidencia eliminada correctamente');
  } catch (err) {
    console.error('Error al eliminar la incidencia:', err);
    mostrarAlerta('Error al eliminar la incidencia', 'error');
  }
};

defineExpose({
  obtenerIncidencias
});
</script>

<template>
        <v-container>
            <!-- Espacio para la segunda sección -->
            <fieldset>
              <legend>Visualizacion de incidencias</legend>
              <v-btn color="purple" class="mt-3" @click="obtenerIncidencias">
                Mostrar Incidencias
              </v-btn>
                <!-- Alerta para mensajes -->
                <v-alert
                  v-model="alerta.visible"
                  :type="alerta.tipo"
                  closable
                  transition="scale-transition"
                  class="mb-4"
                >
                  {{ alerta.texto }}
                </v-alert>
                  <v-row>
                    <v-col>
                      <v-list>
                        <v-list-item v-for="incidencia in incidencias" :key="incidencia.id" :value="incidencia.id" rounded class="mb-2" @click="mostrarDetalle(incidencia)">
                          <v-list-item-title>
                            <span class="font-weight-bold">#{{ incidencia.id }}</span> - {{ incidencia.titulo }}
                          </v-list-item-title>
                          
                          <template v-slot:subtitle>{{ incidencia.descripcion }}</template>
                          
                          <template v-slot:append>
                            <div class="d-flex align-center">
                              <v-chip :color="getUrgenciaColor(incidencia.urgencia)" class="mr-2">
                                {{ incidencia.urgencia }}
                              </v-chip>
                              
                              <v-btn density="compact" size="small" class="mr-1" @click.stop="editarIncidencia(incidencia.id)" 
                                  color="blue" icon>
                                  <v-icon size="small">mdi-pencil</v-icon>
                              </v-btn>
                              
                              <v-btn density="compact" size="small" @click.stop="confirmarEliminar(incidencia.id)" 
                                  color="red" icon>
                                  <v-icon size="small">mdi-delete</v-icon>
                              </v-btn>
                            </div>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
              </fieldset>
            <!-- Componente de detalle de incidencia separado -->
            <DetalleIncidencia
              :show="dialogoDetalle"
              @update:show="dialogoDetalle = $event"
              :incidencia="incidenciaSeleccionada"
              :coloresUrgencia="coloresUrgencia"
              @editar="editarIncidencia"
              @eliminar="confirmarEliminar"
            />

            <EdicionIncidencia
              :show="dialogoEdicion"
              @update:show="dialogoEdicion = $event"
              :incidencia="incidenciaEditando"
              @guardar="guardarEdicion"
            />

            <!-- Diálogo de confirmación de eliminación -->
            <v-dialog v-model="dialogoEliminar" max-width="400px">
              <v-card>
                <v-card-title class="text-h5 bg-red text-white">
                  Confirmar Eliminación
                </v-card-title>
                
                <v-card-text class="pt-4">
                  ¿Estás seguro de que deseas eliminar esta incidencia? Esta acción no se puede deshacer.
                </v-card-text>
                
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey" text @click="dialogoEliminar = false">Cancelar</v-btn>
                  <v-btn color="red" @click="eliminarIncidencia">Eliminar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
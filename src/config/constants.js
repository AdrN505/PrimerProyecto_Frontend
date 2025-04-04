// config/constants.js

// Constantes de la API
export const API_URL = 'http://localhost:8000';
// Se puede añadir más endpoints para posibles futuras rutas.
export const ENDPOINTS = {
  INCIDENCIAS: `${API_URL}/incidencias`
};

// Constantes de la aplicación
export const NIVELES_URGENCIA = ['Baja', 'Media', 'Alta', 'Muy Alta'];

// Colores para los niveles de urgencia (para usar con Vuetify)
export const COLORES_URGENCIA = {
  'muy alta': 'red-darken-4',
  'alta': 'red',
  'media': 'amber',
  'baja': 'green'
};

export const REGLAS_VALIDACION = {
  requerido: [v => !!v || 'Este campo es requerido']
};
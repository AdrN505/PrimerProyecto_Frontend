// config/constants.js

// Constantes de la API
export const API_URL = 'http://localhost:8000';
// Se puede añadir más endpoints para posibles futuras rutas.
export const ENDPOINTS = {
  INCIDENCIAS: `${API_URL}/incidencias`
};

// Constantes de la aplicación
export const NIVELES_URGENCIA = ['Baja', 'Media', 'Alta', 'Muy Alta'];

export const REGLAS_VALIDACION = {
  requerido: [v => !!v || 'Este campo es requerido']
};
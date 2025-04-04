// services/incidenciasService.js
import { ENDPOINTS } from '@/config/constants';

/**
 * Transforma las fechas de una incidencia de string a objetos Date válidos
 * @param {Object} incidencia - Incidencia a transformar
 * @returns {Object} Incidencia con fechas transformadas
 */
const transformarFechasIncidencia = (incidencia) => {
  return {
    ...incidencia,
    created_at: incidencia.created_at ? new Date(incidencia.created_at) : null,
    updated_at: incidencia.updated_at ? new Date(incidencia.updated_at) : null,
    // Añadir fechasFormateadas para facilitar la visualización
    fechaCreacion: incidencia.created_at 
      ? new Date(incidencia.created_at).toLocaleDateString() 
      : 'Fecha no disponible',
    fechaActualizacion: incidencia.updated_at 
      ? new Date(incidencia.updated_at).toLocaleDateString() 
      : 'Fecha no disponible'
  };
};

export const incidenciasService = {
  async crear(incidencia) {
    try {
      const response = await fetch(ENDPOINTS.INCIDENCIAS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incidencia),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la incidencia');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear incidencia:', error);
      throw error;
    }
  },

  // Obtener todas las incidencias
  async obtenerTodas() {
    try {
      const response = await fetch(ENDPOINTS.INCIDENCIAS);
      
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }
      
      const incidencias = await response.json();
      // Transformar las fechas de todas las incidencias
      return incidencias.map(incidencia => transformarFechasIncidencia(incidencia));

    } catch (error) {
      console.error('Error al obtener incidencias:', error);
      throw error;
    }
  },
  
  // Obtener una incidencia por su ID
  async obtenerPorId(id) {
    try {
      const response = await fetch(`${ENDPOINTS.INCIDENCIAS}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }
      
      const incidencia = await response.json();
      return transformarFechasIncidencia(incidencia);

    } catch (error) {
      console.error(`Error al obtener incidencia ${id}:`, error);
      throw error;
    }
  },


    async actualizar(id, incidencia) {
      const response = await fetch(`/api/incidencias/${id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidencia)
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar la incidencia');
      }
  
      return await response.json();
    }
  
};
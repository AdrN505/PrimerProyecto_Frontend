// services/incidenciasService.js
import { ENDPOINTS, PAGINACION } from '@/config/constants';


/**
 * Transforma las fechas de una incidencia de string a objetos Date válidos
 */
const transformarFechasIncidencia = ({ created_at, updated_at, ...incidencia }) => ({
  ...incidencia,
  created_at: created_at ? new Date(created_at) : null,
  updated_at: updated_at ? new Date(updated_at) : null,
  fechaCreacion: created_at 
    ? new Date(created_at).toLocaleDateString() 
    : 'Fecha no disponible',
  fechaActualizacion: updated_at 
    ? new Date(updated_at).toLocaleDateString() 
    : 'Fecha no disponible'
});

/**
 * Maneja errores de la API de forma consistente
 */
const manejarError = (error, mensaje) => {
  console.error(`${mensaje}:`, error);
  throw error;
};

export const incidenciasService = {
  // Crear una nueva incidencia
  async crear(incidencia) {
    try {
      const response = await fetch(ENDPOINTS.INCIDENCIAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidencia),
      });
      
      if (!response.ok) throw new Error('Error al enviar la incidencia');
      return await response.json();
    } catch (error) {
      manejarError(error, 'Error al crear incidencia');
    }
  },
  
  // Obtener todas las incidencias
  async obtenerTodas(page = 1, perPage = PAGINACION.ITEMS_POR_PAGINA_DEFAULT, filtros = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Añadir parámetros de paginación
      queryParams.append('page', page);
      queryParams.append('per_page', perPage);
      
      // Añadir filtros si existen
      if (filtros.search) queryParams.append('search', filtros.search);
      if (filtros.urgencia && filtros.urgencia.length > 0) {
        filtros.urgencia.forEach(u => {
          queryParams.append('urgencia[]', u);
        });
      }
      
      const response = await fetch(`${ENDPOINTS.INCIDENCIAS}?${queryParams.toString()}`);
      
      if (!response.ok) throw new Error(`Error de red: ${response.status}`);
      
      const resultado = await response.json();
      
      // Si la respuesta es paginada, usar los datos paginados
      if (resultado.data) {
        return {
          incidencias: resultado.data.map(transformarFechasIncidencia),
          pagination: {
            total: resultado.total,
            currentPage: resultado.current_page,
            perPage: resultado.per_page,
            lastPage: resultado.last_page
          }
        };
      }
      
      // Si la respuesta no está paginada (compatibilidad con versiones anteriores)
      return resultado.map(transformarFechasIncidencia);
    } catch (error) {
      manejarError(error, 'Error al obtener incidencias');
    }
  },
    
  // Obtener una incidencia por su ID
  async obtenerPorId(id) {
    try {
      const response = await fetch(`${ENDPOINTS.INCIDENCIAS}/${id}`);
      
      if (!response.ok) throw new Error(`Error de red: ${response.status}`);
      
      const incidencia = await response.json();
      return transformarFechasIncidencia(incidencia);
    } catch (error) {
      manejarError(error, `Error al obtener incidencia ${id}`);
    }
  },
     
  // Actualizar una incidencia existente
  async actualizar(id, incidencia) {
    try {
      const response = await fetch(`${ENDPOINTS.INCIDENCIAS}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidencia)
      });
      
      if (!response.ok) throw new Error('Error al actualizar la incidencia');
      
      return await response.json();
    } catch (error) {
      manejarError(error, 'Error al actualizar incidencia');
    }
  },
     
  // Eliminar una incidencia
  async eliminar(id) {
    try {
      const response = await fetch(`${ENDPOINTS.INCIDENCIAS}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`Error al eliminar la incidencia: ${response.statusText}`);
      
      // Si el servidor responde con 204 No Content, no intentamos parsear el cuerpo
      if (response.status === 204) {
        return { message: 'Incidencia eliminada correctamente' };
      }
      
      return await response.json();
    } catch (error) {
      manejarError(error, 'Error al eliminar incidencia');
    }
  }
};
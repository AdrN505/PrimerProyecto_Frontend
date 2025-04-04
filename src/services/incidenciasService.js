// services/incidenciasService.js
import { ENDPOINTS } from '@/config/constants';

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
  }
};
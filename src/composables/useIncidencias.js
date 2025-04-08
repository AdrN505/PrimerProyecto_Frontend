// composables/useIncidencias.js
import { ref, computed } from 'vue';
import { incidenciasService } from '@/services/incidenciasService';
import { useAlerta } from '@/composables/useAlerta';

export default function useIncidencias() {
  const incidencias = ref([]);
  const incidenciasFiltradas = ref([]);
  const cargando = ref(false);
  const error = ref(null);
  const { alerta, mostrarAlerta } = useAlerta();

  // Obtener todas las incidencias
  const obtenerIncidencias = async () => {
    cargando.value = true;
    error.value = null;
    
    try {
      incidencias.value = await incidenciasService.obtenerTodas();
      incidenciasFiltradas.value = [...incidencias.value];
    } catch (err) {
      console.error('Error al obtener incidencias:', err);
      error.value = 'No se pudieron cargar las incidencias';
    } finally {
      cargando.value = false;
    }
  };

  // Editar una incidencia
  const editarIncidencia = async (incidenciaActualizada) => {
    try {
      await incidenciasService.actualizar(incidenciaActualizada.id, incidenciaActualizada);
      await obtenerIncidencias();
      await mostrarAlerta('Incidencia editada con éxito', 'success');
      return true;
    } catch (err) {
      console.error('Error al actualizar incidencia:', err);
      mostrarAlerta('No se pudo actualizar la incidencia', 'error');
      return false;
    }
  };

  // Eliminar una incidencia
  const eliminarIncidencia = async (incidencia) => {
    try {
      await incidenciasService.eliminar(incidencia.id, incidencia);
      await obtenerIncidencias();
      await mostrarAlerta('Incidencia eliminada con éxito', 'success');
      return true;
    } catch (err) {
      console.error('Error al eliminar incidencia:', err);
      mostrarAlerta('No se pudo eliminar la incidencia', 'error');
      return false;
    }
  };

  // Aplicar filtros de búsqueda
  const aplicarFiltros = (resultados) => {
    incidenciasFiltradas.value = resultados;
  };

  return {
    incidencias,
    incidenciasFiltradas,
    cargando,
    error,
    alerta,
    obtenerIncidencias,
    editarIncidencia,
    eliminarIncidencia,
    aplicarFiltros
  };
}
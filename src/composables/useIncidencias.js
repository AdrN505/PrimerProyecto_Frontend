// composables/useIncidencias.js
import { ref, reactive } from 'vue';
import { incidenciasService } from '@/services/incidenciasService';
import { useAlerta } from '@/composables/useAlerta';
import { PAGINACION } from '@/config/constants';

export default function useIncidencias() {
  const incidencias = ref([]);
  const cargando = ref(false);
  const error = ref(null);
  const { alerta, mostrarAlerta } = useAlerta();
  
    // Estado de paginación y filtros
    const paginacion = reactive({
        total: 0,
        paginaActual: 1,
        itemsPorPagina: PAGINACION.ITEMS_POR_PAGINA_DEFAULT,
        totalPaginas: 0
    });
  
  // Estado de filtros
  const filtros = reactive({
    terminoBusqueda: '',
    urgencia: []
  });
  
  // Obtener incidencias con filtros y paginación
    const obtenerIncidencias = async () => {
        cargando.value = true;
        error.value = null;
        
        try {
        const resultado = await incidenciasService.obtenerTodas(
            paginacion.paginaActual,
            paginacion.itemsPorPagina,
            {
            search: filtros.terminoBusqueda,
            urgencia: filtros.urgencia
            }
        );
        
        // Comprobar si la respuesta contiene información de paginación
        if (resultado.incidencias && resultado.pagination) {
            incidencias.value = resultado.incidencias;
            
            // Actualizar información de paginación
            paginacion.total = resultado.pagination.total;
            paginacion.totalPaginas = resultado.pagination.lastPage;
            paginacion.paginaActual = resultado.pagination.currentPage;
            paginacion.itemsPorPagina = resultado.pagination.perPage;
        } else {
            // Compatibilidad con respuestas no paginadas
            incidencias.value = resultado;
        }
        } catch (err) {
        console.error('Error al obtener incidencias:', err);
        error.value = 'No se pudieron cargar las incidencias';
        } finally {
        cargando.value = false;
        }
    };
  
  // Cambiar página
  const cambiarPagina = (pagina) => {
    paginacion.paginaActual = pagina;
    obtenerIncidencias();
  };
  
  // Cambiar items por página
  const cambiarItemsPorPagina = (cantidad) => {
    paginacion.itemsPorPagina = cantidad;
    paginacion.paginaActual = 1; // Resetear a primera página
    obtenerIncidencias();
  };
  
  // Aplicar filtros de búsqueda
  const aplicarFiltros = (termino, urgencias) => {
    filtros.terminoBusqueda = termino;
    filtros.urgencia = urgencias;
    paginacion.paginaActual = 1; // Resetear a primera página
    obtenerIncidencias();
  };
  
  // Métodos para acciones CRUD (mantener los existentes)
  const editarIncidencia = async (incidenciaActualizada) => {
    try {
      await incidenciasService.actualizar(incidenciaActualizada.id, incidenciaActualizada);
      await obtenerIncidencias(); // Refrescar la lista
      await mostrarAlerta('Incidencia editada con éxito', 'success');
      return true;
    } catch (err) {
      console.error('Error al actualizar incidencia:', err);
      mostrarAlerta('No se pudo actualizar la incidencia', 'error');
      return false;
    }
  };
  
  const eliminarIncidencia = async (incidencia) => {
    try {
      await incidenciasService.eliminar(incidencia.id, incidencia);
      await obtenerIncidencias(); // Refrescar la lista
      await mostrarAlerta('Incidencia eliminada con éxito', 'success');
      return true;
    } catch (err) {
      console.error('Error al eliminar incidencia:', err);
      mostrarAlerta('No se pudo eliminar la incidencia', 'error');
      return false;
    }
  };
  
  return {
    incidencias,
    cargando,
    error,
    alerta,
    paginacion,
    filtros,
    obtenerIncidencias,
    cambiarPagina,
    cambiarItemsPorPagina,
    aplicarFiltros,
    editarIncidencia,
    eliminarIncidencia
  };
}
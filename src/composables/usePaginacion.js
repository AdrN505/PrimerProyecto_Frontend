// composables/usePaginacion.js
import { ref, computed } from 'vue';

export default function usePaginacion(items, itemsPorPagina = 5) {
  // Configuración de paginación
  const paginaActual = ref(1);
  const itemsPerPage = ref(itemsPorPagina);
  const opcionesPaginas = [5, 10, 15, 25, 50];

  // Calcular total de páginas
  const totalPaginas = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage.value);
  });

  // Obtener items de la página actual
  const itemsPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * itemsPerPage.value;
    const fin = inicio + itemsPerPage.value;
    return items.value.slice(inicio, fin);
  });

  // Ir a la página siguiente
  const siguientePagina = () => {
    if (paginaActual.value < totalPaginas.value) {
      paginaActual.value++;
    }
  };

  // Ir a la página anterior
  const anteriorPagina = () => {
    if (paginaActual.value > 1) {
      paginaActual.value--;
    }
  };

  // Ir a una página específica
  const irAPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas.value) {
      paginaActual.value = pagina;
    }
  };

  // Cambiar cantidad de items por página
  const cambiarItemsPorPagina = (cantidad) => {
    itemsPerPage.value = cantidad;
    // Reset a la página 1 para evitar confusiones
    paginaActual.value = 1;
  };

  return {
    paginaActual,
    itemsPerPage,
    opcionesPaginas,
    totalPaginas,
    itemsPaginados,
    siguientePagina,
    anteriorPagina,
    irAPagina,
    cambiarItemsPorPagina
  };
}
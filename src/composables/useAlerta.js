// composables/useAlerta.js

import { ref } from 'vue';

export function useAlerta() {
  const alerta = ref({
    visible: false,
    mensaje: '',
    tipo: 'success'
  });

  const mostrarAlerta = (mensaje, tipo = 'success', duracion = 3000) => {
    alerta.value = {
      visible: true,
      mensaje,
      tipo
    };
    
    if (duracion > 0) {
      setTimeout(() => {
        alerta.value.visible = false;
      }, duracion);
    }
  };

  return {
    alerta,
    mostrarAlerta
  };
}
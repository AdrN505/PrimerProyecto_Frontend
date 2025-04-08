// composables/useResponsive.js
import { ref, onMounted, onUnmounted } from 'vue';

export default function useResponsive(breakpoint = 600) {
  const isMobile = ref(false);
  
  const checkMobileDisplay = () => {
    isMobile.value = window.innerWidth < breakpoint;
  };
  
  onMounted(() => {
    checkMobileDisplay();
    window.addEventListener('resize', checkMobileDisplay);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobileDisplay);
  });
  
  return {
    isMobile
  };
}
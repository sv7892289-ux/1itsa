// /js/mobile-menu.js - Menú hamburguesa mejorado
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav-menu');
  
  // Crear overlay para cerrar el menú
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  if (menuToggle && mainNav) {
    // Función para abrir el menú
    function openMenu() {
      mainNav.classList.add('active');
      menuToggle.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    // Función para cerrar el menú
    function closeMenu() {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // Restaurar scroll
    }

    // Abrir/cerrar menú al hacer clic en el botón hamburguesa
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mainNav.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Cerrar menú al hacer clic en el overlay
    overlay.addEventListener('click', closeMenu);

    // Cerrar menú al hacer clic en un enlace del menú
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        closeMenu();
      }
    });

    // Cerrar menú al redimensionar la ventana (si vuelve a desktop)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800 && mainNav.classList.contains('active')) {
        closeMenu();
      }
    });
    // Solución para el problema de bfcache (navegación atrás/adelante)
    window.addEventListener('pageshow', (event) => {
      // Si la página se carga desde la bfcache (cache del navegador para atrás/adelante)
      // y el menú estaba activo, lo cerramos para evitar que la página se quede bloqueada.
      if (event.persisted && mainNav.classList.contains('active')) {
        closeMenu();
      }
    });
  }
});
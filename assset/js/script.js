// Funcionalidad del menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('[data-testid="button-mobile-menu"]');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Funcionalidad del modal de login
    const loginBtn = document.querySelector('[data-testid="button-login"]');
    const loginModal = document.querySelector('[data-testid="modal-login"]');
    const closeLoginBtn = document.querySelector('[data-testid="button-close-login"]');
    const bg = document.querySelector('[data-state=open]');
    bg.style.display = 'none';

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
            bg.style.display = 'block';
        });

        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', function() {
                loginModal.style.display = 'none';
                bg.style.display = 'none';
            });
        }

        // Cerrar modal al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!loginModal.contains(event.target) && !loginBtn.contains(event.target)) {
                loginModal.style.display = 'none';
                bg.style.display = 'none';
            }
        });
    }
});

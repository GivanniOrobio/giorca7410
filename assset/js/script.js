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

    // Funcionalidad de los modales
    const loginBtn = document.querySelector('[data-testid="button-login"]');
    const loginModal = document.querySelector('[data-testid="modal-login"]');
    const closeLoginBtn = document.querySelector('[data-testid="button-close-login"]');
    const registerModal = document.querySelector('[data-testid="modal-register"]');
    const closeRegisterBtn = document.querySelector('[data-testid="button-close-register"]');
    const switchToRegisterBtn = document.querySelector('[data-testid="button-switch-register"]');
    const switchToLoginBtn = document.querySelector('[data-testid="button-switch-login"]');
    const bg = document.querySelector('[data-state=open]');
    bg.style.display = 'none';
    registerModal.style.display = 'none'; // Ocultar modal de registro inicialmente

    // Abrir modal de login
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
            if (!loginModal.contains(event.target) && !loginBtn.contains(event.target) &&
                !registerModal.contains(event.target)) {
                loginModal.style.display = 'none';
                registerModal.style.display = 'none';
                bg.style.display = 'none';
            }
        });
    }

    // Alternar a registro desde login
    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }

    // Alternar a login desde registro
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', function() {
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    // Cerrar modal de registro
    if (closeRegisterBtn) {
        closeRegisterBtn.addEventListener('click', function() {
            registerModal.style.display = 'none';
            bg.style.display = 'none';
        });
    }

    // Funcionalidad del formulario de registro
    const registerForm = document.querySelector('[data-testid="form-register"]');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir envío por defecto

            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;

            let isValid = true;
            let errors = [];

            // Validar nombre
            if (name.length < 2) {
                isValid = false;
                errors.push('El nombre debe tener al menos 2 caracteres.');
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                errors.push('Por favor, ingresa un email válido.');
            }

            // Validar contraseña
            if (password.length < 6) {
                isValid = false;
                errors.push('La contraseña debe tener al menos 6 caracteres.');
            }

            if (isValid) {
                // Simular envío exitoso
                alert('¡Registro exitoso! Bienvenido ' + name + '.');
                // Limpiar formulario
                registerForm.reset();
                // Cerrar modal
                registerModal.style.display = 'none';
                bg.style.display = 'none';
            } else {
                // Mostrar errores
                alert('Errores en el formulario:\n' + errors.join('\n'));
            }
        });
    }
});

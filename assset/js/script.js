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

    // Funcionalidad del carrito
    const cartBtn = document.querySelector('[data-testid="button-cart"]');
    const cartModal = document.querySelector('[data-testid="modal-cart"]');
    const closeCartBtn = document.querySelector('[data-testid="button-close-cart"]');
    const cartItemsContainer = cartModal.querySelector('.flex-1');
    const cartEmptyText = cartModal.querySelector('[data-testid="text-cart-empty"]');

    // Función para obtener carrito de localStorage
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Función para guardar carrito en localStorage
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
    }

    // Función para agregar producto al carrito
    function addToCart(productId, name, price) {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, name: name, price: parseFloat(price), quantity: 1 });
        }

        saveCart(cart);
        renderCart();
        alert('Producto agregado al carrito');
    }

    // Función para remover producto del carrito
    function removeFromCart(productId) {
        const cart = getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        saveCart(updatedCart);
        renderCart();
    }

    // Función para actualizar cantidad
    function updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const cart = getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            saveCart(cart);
            renderCart();
        }
    }

    // Función para calcular total
    function calculateTotal() {
        const cart = getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Función para renderizar carrito
    function renderCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.appendChild(cartEmptyText);
            return;
        }

        cartEmptyText.style.display = 'none';

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'flex items-center justify-between py-4 border-b border-border';
            itemDiv.innerHTML = `
                <div>
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-sm text-muted-foreground">$${item.price.toFixed(2)} cada uno</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8" data-action="decrease" data-product-id="${item.id}">-</button>
                    <span class="w-8 text-center">${item.quantity}</span>
                    <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8" data-action="increase" data-product-id="${item.id}">+</button>
                    <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8" data-action="remove" data-product-id="${item.id}">×</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        // Agregar total
        const totalDiv = document.createElement('div');
        totalDiv.className = 'py-4 border-t border-border';
        totalDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-semibold">Total:</span>
                <span class="font-bold text-primary">$${calculateTotal().toFixed(2)}</span>
            </div>
            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4">Proceder al Pago</button>
        `;
        cartItemsContainer.appendChild(totalDiv);

        // Agregar event listeners para botones
        cartItemsContainer.addEventListener('click', function(event) {
            const target = event.target;
            const productId = target.getAttribute('data-product-id');
            const action = target.getAttribute('data-action');

            if (action === 'increase') {
                updateQuantity(productId, getCart().find(item => item.id === productId).quantity + 1);
            } else if (action === 'decrease') {
                updateQuantity(productId, getCart().find(item => item.id === productId).quantity - 1);
            } else if (action === 'remove') {
                removeFromCart(productId);
            }
        });
    }

    // Función para actualizar contador del carrito
    function updateCartCounter() {
        const cart = getCart();
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const counter = cartBtn.querySelector('.cart-counter') || document.createElement('span');
        counter.className = 'cart-counter absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center';
        counter.textContent = totalItems;
        if (totalItems > 0) {
            cartBtn.appendChild(counter);
        } else {
            const existingCounter = cartBtn.querySelector('.cart-counter');
            if (existingCounter) existingCounter.remove();
        }
    }

    // Evento para abrir carrito
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function() {
            cartModal.style.display = 'flex';
            bg.style.display = 'block';
            renderCart();
        });

        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', function() {
                cartModal.style.display = 'none';
                bg.style.display = 'none';
            });
        }

        // Cerrar modal al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!cartModal.contains(event.target) && !cartBtn.contains(event.target)) {
                cartModal.style.display = 'none';
                bg.style.display = 'none';
            }
        });
    }

    // Evento para agregar productos al carrito
    document.addEventListener('click', function(event) {
        if (event.target.textContent === 'Agregar al Carrito') {
            const productId = event.target.getAttribute('data-product-id');
            const name = event.target.getAttribute('data-product-name');
            const price = event.target.getAttribute('data-product-price');
            addToCart(productId, name, price);
        }
    });

    // Inicializar contador del carrito
    updateCartCounter();

    // Funcionalidad del slider
    const slideImage = document.querySelector('[data-testid="img-slide-0"]');
    const prevBtn = document.querySelector('[data-testid="button-prev-slide"]');
    const nextBtn = document.querySelector('[data-testid="button-next-slide"]');
    const slideIndicators = [
        document.querySelector('[data-testid="button-slide-0"]'),
        document.querySelector('[data-testid="button-slide-1"]'),
        document.querySelector('[data-testid="button-slide-2"]')
    ];

    const slides = [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        'https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080'
    ];

    let currentSlide = 0;

    function updateSlide() {
        slideImage.src = slides[currentSlide];
        slideIndicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.remove('bg-white/50');
                indicator.classList.add('bg-white');
            } else {
                indicator.classList.remove('bg-white');
                indicator.classList.add('bg-white/50');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
    }

    // Eventos para botones prev y next
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Eventos para indicadores
    slideIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Auto-slide opcional (cada 5 segundos)
    setInterval(nextSlide, 5000);

    // Inicializar slider
    updateSlide();
});

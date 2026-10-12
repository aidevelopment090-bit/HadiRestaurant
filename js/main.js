/**
 * HADI Restaurant - Modern Fine Dining & Luxury Lounge
 * Core JavaScript: Navigation, Ordering System, Cart, Lightbox, Reservations & WhatsApp API
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- RESTAURANT CONFIGURATION ---
    const CONFIG = {
        restaurantName: 'HADI Restaurant & Lounge',
        whatsappNumber: '12345678900', // International format without '+' or spaces
        currencySymbol: '$',
        taxRate: 0.05, // 5% service/tax
        deliveryFee: 10.00
    };

    // --- STATE MANAGEMENT ---
    let cart = [];
    let currentGalleryIndex = 0;
    const galleryItemsData = [];

    // Load cart from LocalStorage if available
    try {
        const savedCart = localStorage.getItem('hadi_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.warn('LocalStorage not accessible', e);
    }

    // --- DOM ELEMENT REFERENCES ---
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Mobile Drawer
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Cart Elements
    const cartBtn = document.getElementById('cart-btn');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartEmptyState = document.getElementById('cart-empty-state');
    const cartNotesContainer = document.getElementById('cart-notes-container');
    const cartDrawerFooter = document.getElementById('cart-drawer-footer');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartTotalEl = document.getElementById('cart-total');
    const cartFeeLabelEl = document.getElementById('cart-fee-label');
    const openCartBannerBtn = document.getElementById('open-cart-banner-btn');
    const whatsappCheckoutBtn = document.getElementById('whatsapp-checkout-btn');
    const placeInstantOrderBtn = document.getElementById('place-instant-order-btn');
    const orderSpecialInstructions = document.getElementById('order-special-instructions');

    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    // Lightbox
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryFilterBtns = document.querySelectorAll('.g-filter-btn');

    // Reservation Form
    const reservationForm = document.getElementById('reservation-form');
    const whatsappReserveBtn = document.getElementById('whatsapp-reserve-btn');
    const resDateInput = document.getElementById('res-date');

    // Back to top & Toast
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const toastContainer = document.getElementById('toast-container');
    const newsletterForm = document.getElementById('newsletter-form');

    // Set minimum reservation date to today
    if (resDateInput) {
        const today = new Date().toISOString().split('T')[0];
        resDateInput.min = today;
        resDateInput.value = today;
    }

    // =========================================================================
    // 1. HEADER SCROLL & ACTIVE LINK HIGHLIGHTING
    // =========================================================================
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky header class
        if (scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 450) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active link tracking
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // =========================================================================
    // 2. MOBILE NAVIGATION DRAWER
    // =========================================================================
    function openMobileDrawer() {
        mobileDrawer.classList.add('open');
        drawerBackdrop.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        mobileDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileDrawer();
        });
    });

    // =========================================================================
    // 3. MENU CATEGORY FILTERING
    // =========================================================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filterValue = button.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // =========================================================================
    // 4. ONLINE FOOD ORDERING & CART SYSTEM
    // =========================================================================

    function saveCart() {
        try {
            localStorage.setItem('hadi_cart', JSON.stringify(cart));
        } catch (e) {
            console.warn('Could not save cart to LocalStorage', e);
        }
        updateCartBadge();
    }

    function updateCartBadge() {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCountBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartCountBadge.style.transform = 'scale(1.2)';
            setTimeout(() => { cartCountBadge.style.transform = 'scale(1)'; }, 200);
        }
    }

    function addToCart(id, name, price, img) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: parseFloat(price),
                img: img,
                quantity: 1
            });
        }
        saveCart();
        renderCart();
        showToast(`Added "${name}" to your order bag.`, 'success');
    }

    function removeFromCart(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            const removedItem = cart[itemIndex];
            cart.splice(itemIndex, 1);
            saveCart();
            renderCart();
            showToast(`Removed "${removedItem.name}" from your bag.`, 'info');
        }
    }

    function updateItemQuantity(id, delta) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                saveCart();
                renderCart();
            }
        }
    }

    function getOrderType() {
        const selectedRadio = document.querySelector('input[name="orderType"]:checked');
        return selectedRadio ? selectedRadio.value : 'pickup';
    }

    function renderCart() {
        cartItemsList.innerHTML = '';
        const orderType = getOrderType();

        if (cart.length === 0) {
            cartEmptyState.classList.remove('d-none');
            cartNotesContainer.classList.add('d-none');
            cartDrawerFooter.classList.add('d-none');
            return;
        }

        cartEmptyState.classList.add('d-none');
        cartNotesContainer.classList.remove('d-none');
        cartDrawerFooter.classList.remove('d-none');

        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemRow = document.createElement('div');
            itemRow.className = 'cart-item-row';
            itemRow.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-thumb">
                <div class="cart-item-details">
                    <h5 class="cart-item-name">${item.name}</h5>
                    <span class="cart-item-price">${CONFIG.currencySymbol}${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus-btn" data-id="${item.id}" aria-label="Decrease quantity">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="qty-count">${item.quantity}</span>
                    <button class="qty-btn plus-btn" data-id="${item.id}" aria-label="Increase quantity">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <button class="cart-item-remove-btn" data-id="${item.id}" title="Remove item" aria-label="Remove item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartItemsList.appendChild(itemRow);
        });

        // Calculations
        const tax = subtotal * CONFIG.taxRate;
        const total = subtotal + tax;

        cartSubtotalEl.textContent = `${CONFIG.currencySymbol}${subtotal.toFixed(2)}`;
        cartTaxEl.textContent = `${CONFIG.currencySymbol}${tax.toFixed(2)}`;
        cartTotalEl.textContent = `${CONFIG.currencySymbol}${total.toFixed(2)}`;

        // Attach event listeners to quantity buttons
        cartItemsList.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', () => updateItemQuantity(btn.dataset.id, -1));
        });
        cartItemsList.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', () => updateItemQuantity(btn.dataset.id, 1));
        });
        cartItemsList.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
        });
    }

    // Attach "Add to Order" click to all menu cards and showcase buttons
    document.querySelectorAll('.add-to-cart-btn, .quick-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            const img = btn.getAttribute('data-img');
            addToCart(id, name, price, img);
        });
    });

    // Cart Drawer Toggle
    function openCart() {
        cartDrawer.classList.add('open');
        cartBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart();
    }

    function closeCart() {
        cartDrawer.classList.remove('open');
        cartBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
    if (openCartBannerBtn) openCartBannerBtn.addEventListener('click', openCart);

    // Switch Delivery / Pickup
    const switchOptions = document.querySelectorAll('.switch-option');
    switchOptions.forEach(option => {
        option.addEventListener('click', () => {
            switchOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            renderCart();
        });
    });

    // --- CHECKOUT VIA WHATSAPP DIRECT ---
    function checkoutViaWhatsApp() {
        if (cart.length === 0) {
            showToast('Your order bag is empty.', 'error');
            return;
        }

        const orderType = getOrderType() === 'delivery' ? '🚗 Concierge Delivery' : '🛍️ Express Pickup';
        let subtotal = 0;
        let itemsSummary = '';

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            itemsSummary += `${index + 1}. *${item.name}* x ${item.quantity} - $${itemTotal.toFixed(2)}\n`;
        });

        const tax = subtotal * CONFIG.taxRate;
        const total = subtotal + tax;
        const notes = orderSpecialInstructions.value.trim() || 'None';

        const message = 
`👑 *HADI RESTAURANT - ONLINE FOOD ORDER* 👑
-------------------------------------------
*Fulfillment:* ${orderType}

*Order Items:*
${itemsSummary}
-------------------------------------------
*Subtotal:* $${subtotal.toFixed(2)}
*Service & Tax (5%):* $${tax.toFixed(2)}
*Total Amount:* *$${total.toFixed(2)}*

*Special Instructions:*
${notes}
-------------------------------------------
Please confirm my order preparation and payment details. Thank you!`;

        const encodedMsg = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMsg}`;

        window.open(whatsappUrl, '_blank');
        showToast('Redirecting to WhatsApp with your order...', 'success');
    }

    if (whatsappCheckoutBtn) {
        whatsappCheckoutBtn.addEventListener('click', checkoutViaWhatsApp);
    }

    // --- INSTANT WEB ORDER SIMULATION ---
    if (placeInstantOrderBtn) {
        placeInstantOrderBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your bag is empty.', 'error');
                return;
            }

            const orderId = 'HADI-' + Math.floor(100000 + Math.random() * 900000);
            const total = cartTotalEl.textContent;

            // Clear Cart
            cart = [];
            saveCart();
            renderCart();
            closeCart();

            showToast(`Order #${orderId} received! Total: ${total}. Our kitchen is preparing it.`, 'success');
        });
    }

    // =========================================================================
    // 5. GALLERY FILTER & LIGHTBOX MODAL
    // =========================================================================
    // Populate gallery items data for modal
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || img.alt;
        galleryItemsData.push({
            src: img.src,
            caption: caption,
            element: item
        });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentGalleryIndex = index;
        const itemData = galleryItemsData[currentGalleryIndex];
        if (!itemData) return;

        lightboxImage.src = itemData.src;
        lightboxCaption.textContent = itemData.caption;
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function nextLightboxImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryItemsData.length;
        openLightbox(currentGalleryIndex);
    }

    function prevLightboxImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryItemsData.length) % galleryItemsData.length;
        openLightbox(currentGalleryIndex);
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxImage);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxImage);

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightboxImage();
        if (e.key === 'ArrowLeft') prevLightboxImage();
    });

    // Close when clicking outside image
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    // Gallery Category Filtering
    galleryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            galleryFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-gfilter');

            galleryItems.forEach(item => {
                const group = item.getAttribute('data-group');
                if (filter === 'all' || group === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // =========================================================================
    // 6. TABLE RESERVATION & WHATSAPP INTEGRATION
    // =========================================================================

    function validateReservationForm() {
        const name = document.getElementById('res-name').value.trim();
        const phone = document.getElementById('res-phone').value.trim();
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const guests = document.getElementById('res-guests').value;

        if (!name || !phone || !date || !time || !guests) {
            showToast('Please complete all required fields (*).', 'error');
            return null;
        }

        const area = document.getElementById('res-area').value;
        const notes = document.getElementById('res-notes').value.trim() || 'No special requests';

        return { name, phone, date, time, guests, area, notes };
    }

    // Handle Form Submit (Instant confirmation)
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = validateReservationForm();
            if (!data) return;

            const resNumber = 'HADI-VIP-' + Math.floor(1000 + Math.random() * 9000);
            
            showToast(`Table confirmed! Reference ID: #${resNumber}. A confirmation SMS/WhatsApp has been queued for ${data.name}.`, 'success');
            reservationForm.reset();
            if (resDateInput) {
                resDateInput.value = new Date().toISOString().split('T')[0];
            }
        });
    }

    // Handle WhatsApp Direct Table Reservation Button
    if (whatsappReserveBtn) {
        whatsappReserveBtn.addEventListener('click', () => {
            const data = validateReservationForm();
            if (!data) return;

            const message = 
`👑 *HADI RESTAURANT - VIP TABLE RESERVATION* 👑
-------------------------------------------
👤 *Guest Name:* ${data.name}
📞 *Phone / WhatsApp:* ${data.phone}
📅 *Dining Date:* ${data.date}
⏰ *Time Slot:* ${data.time}
👥 *Party Size:* ${data.guests}
🏛️ *Seating Area:* ${data.area}
📝 *Notes / Occasion:* ${data.notes}
-------------------------------------------
Kindly confirm table availability and dining arrangements.`;

            const encodedMsg = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMsg}`;

            window.open(whatsappUrl, '_blank');
            showToast('Connecting to HADI VIP WhatsApp Concierge...', 'success');
        });
    }

    // =========================================================================
    // 7. VIP CONNOISSEUR CLUB / NEWSLETTER
    // =========================================================================
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();

            if (email) {
                showToast(`Welcome to the HADI Connoisseur Circle, ${email}!`, 'success');
                newsletterForm.reset();
            }
        });
    }

    // =========================================================================
    // 8. TOAST NOTIFICATION UTILITY
    // =========================================================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
        
        let iconClass = 'fa-solid fa-bell';
        if (type === 'success') iconClass = 'fa-solid fa-circle-check';
        if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

        toast.innerHTML = `
            <i class="${iconClass} toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 3.8s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3800);
    }

    // Initial render of cart badge
    updateCartBadge();
    renderCart();

    console.log('HADI Restaurant fine dining portal loaded smoothly.');
});

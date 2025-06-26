console.log('scripts.js carregado com sucesso');

document.addEventListener('DOMContentLoaded', function () {


    const getCart = () => JSON.parse(localStorage.getItem('spiritShopCart_v4')) || [];
    const saveCart = (cart) => localStorage.setItem('spiritShopCart_v4', JSON.stringify(cart));

    const showToast = (message, type = 'success') => {
        const container = document.querySelector('.toast-container') || (() => {
            const c = document.createElement('div');
            c.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            c.style.zIndex = 1100;
            document.body.appendChild(c);
            return c;
        })();
        container.insertAdjacentHTML('beforeend', `<div class="toast align-items-center text-white bg-${type} border-0" role="alert"><div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`);
        new bootstrap.Toast(container.lastElementChild, { delay: 3000 }).show();
    };

    const updateMiniCart = () => {
        const cart = getCart();
        const miniCart = document.getElementById('miniCartDropdown');
        const badge = document.getElementById('cart-count-badge');
        if (!miniCart || !badge) return;

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';

        if (cart.length === 0) {
            miniCart.innerHTML = '<div class="text-center p-3">Seu carrinho está vazio.</div>';
            return;
        }

        let subtotal = 0;
        const itemsHtml = cart.map(item => {
            const price = parseFloat(item.price.replace('.', '').replace(',', '.'));
            subtotal += price * item.quantity;
            const imageUrl = item.image.startsWith('http') ? item.image : (window.BASE_URL ? window.BASE_URL + item.image : item.image);
            return `
                <div class="dropdown-item-cart d-flex align-items-center gap-2 mb-2 p-2">
                    <img src="${imageUrl}" alt="${item.title}" class="rounded" width="60" height="60" style="object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 small">${item.title}</h6>
                        <small class="text-muted">R$ ${item.price}</small>
                    </div>
                    <div class="cart-item-actions d-flex flex-column align-items-center">
                        <div class="input-group input-group-sm" style="width: 80px;">
                            <button class="btn btn-outline-secondary quantity-change" data-product-id="${item.id}" data-op="minus">-</button>
                            <span class="form-control text-center bg-light">${item.quantity}</span>
                            <button class="btn btn-outline-secondary quantity-change" data-product-id="${item.id}" data-op="plus">+</button>
                        </div>
                        <button class="btn btn-link text-danger p-0 mt-1 remove-from-cart" data-product-id="${item.id}"><small>Remover</small></button>
                    </div>
                </div>`;
        }).join('');

        miniCart.innerHTML = `<div class="p-2" style="max-height: 350px; overflow-y: auto;">${itemsHtml}</div><hr class="my-1"><div class="p-2"><div class="d-flex justify-content-between mb-2"><strong>Subtotal:</strong><strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong></div><div class="d-grid gap-2"><a href="${BASE_URL}pages/checkout.php" class="btn btn-primary">Finalizar Compra</a></div></div>`;
    };

    const renderCheckout = () => {
        const cart = getCart();
        const container = document.getElementById('cartItemsContainer');
        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<div class="alert alert-warning">Seu carrinho está vazio.</div>';
            subtotalEl.textContent = 'R$ 0,00';
            shippingEl.textContent = 'R$ 0,00';
            totalEl.textContent = 'R$ 0,00';
            return;
        }

        let subtotal = 0;
        container.innerHTML = cart.map(item => {
            const price = parseFloat(item.price.replace('.', '').replace(',', '.'));
            subtotal += price * item.quantity;
            const imageUrl = item.image.startsWith('http') ? item.image : (window.BASE_URL ? window.BASE_URL + item.image : item.image);
            return `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <img src="${imageUrl}" width="70" height="70" class="rounded me-3" style="object-fit: cover;">
                        <div>
                            <h6 class="mb-0">${item.title}</h6>
                            <small class="text-muted">R$ ${item.price}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                         <div class="input-group input-group-sm" style="width: 90px;">
                            <button class="btn btn-outline-secondary quantity-change" data-product-id="${item.id}" data-op="minus">-</button>
                            <span class="form-control text-center bg-light">${item.quantity}</span>
                            <button class="btn btn-outline-secondary quantity-change" data-product-id="${item.id}" data-op="plus">+</button>
                        </div>
                        <button class="btn btn-sm btn-outline-danger ms-2 remove-from-cart" data-product-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
             `;
        }).join('');

        const shipping = subtotal > 0 ? 15.00 : 0;
        const total = subtotal + shipping;

        subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        shippingEl.textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
        totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    };

    const addToCart = (productData, quantity = 1) => {
        let cart = getCart();
        const existingItem = cart.find(item => item.id === productData.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            productData.quantity = quantity;
            cart.push(productData);
        }
        saveCart(cart);
        updateAll();
        showToast('Produto adicionado ao carrinho!');
    };

    const changeCartQuantity = (productId, operation) => {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            if (operation === 'plus') {
                cart[itemIndex].quantity++;
                showToast('Quantidade atualizada!');
            } else if (operation === 'minus') {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                    showToast('Produto removido do carrinho!', 'danger');
                } else {
                    showToast('Quantidade atualizada!');
                }
            }
            saveCart(cart);
            updateAll();
        }
    };

    const removeFromCart = (productId) => {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        updateAll();
        showToast('Produto removido do carrinho!', 'danger');
    };

    const updateAll = () => {
        updateMiniCart();
        renderCheckout();
    };

    console.log('Inicializando sistema de avaliações');

    const getReviews = () => {
        const key = `spiritShopReviews_${window.location.pathname}`;
        return JSON.parse(localStorage.getItem(key)) || [];
    };

    const saveReviews = (reviews) => {
        const key = `spiritShopReviews_${window.location.pathname}`;
        localStorage.setItem(key, JSON.stringify(reviews));
    };

    const updateReviewsUI = () => {
        const reviews = getReviews();
        const total = reviews.length;
        const avg = total === 0 ? 0 : (reviews.reduce((sum, r) => sum + r.rating, 0) / total);
        const avgStarsContainer = document.getElementById('averageRatingStars');
        const avgValue = document.getElementById('averageRatingValue');
        const totalReviewsCount = document.getElementById('totalReviewsCount');
        const reviewsList = document.getElementById('reviewsList');

        if (!avgStarsContainer || !avgValue || !totalReviewsCount || !reviewsList) return;

        avgValue.textContent = avg.toFixed(1);
        totalReviewsCount.textContent = `(${total} avaliação${total !== 1 ? 'es' : ''})`;

        avgStarsContainer.innerHTML = '';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.classList.add('fas', 'fa-star', 'fa-lg');
            if (i <= Math.round(avg)) {
                star.classList.add('text-warning');
            } else {
                star.classList.add('text-muted');
            }
            avgStarsContainer.appendChild(star);
        }

        reviewsList.innerHTML = reviews.map(r => `
            <div class="border-bottom mb-3 pb-3">
                <strong>${r.name}</strong> <br>
                <small class="text-warning">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</small><br>
                <p>${r.comment}</p>
            </div>
        `).join('');
    };

    let selectedRating = 0;

    const ratingStarsForm = document.querySelectorAll('.rating-stars-form i');
    ratingStarsForm.forEach(star => {
        star.addEventListener('click', function () {
            selectedRating = parseInt(this.dataset.value);
            console.log('Nota selecionada:', selectedRating);

            ratingStarsForm.forEach(s => {
                if (parseInt(s.dataset.value) <= selectedRating) {
                    s.classList.add('text-warning');
                    s.classList.remove('text-muted');
                } else {
                    s.classList.remove('text-warning');
                    s.classList.add('text-muted');
                }
            });
        });
    });

    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('reviewName');
            const commentInput = document.getElementById('reviewText');

            if (selectedRating === 0) {
                alert('Por favor, selecione uma nota.');
                return;
            }
            if (!nameInput.value.trim()) {
                alert('Por favor, informe seu nome.');
                return;
            }
            if (!commentInput.value.trim()) {
                alert('Por favor, escreva um comentário.');
                return;
            }

            const reviews = getReviews();

            reviews.push({
                rating: selectedRating,
                name: nameInput.value.trim(),
                comment: commentInput.value.trim(),
                date: new Date().toISOString()
            });

            saveReviews(reviews);

            reviewForm.reset();
            selectedRating = 0;
            ratingStarsForm.forEach(s => {
                s.classList.remove('text-warning');
                s.classList.add('text-muted');
            });

            updateReviewsUI();
            showToast('Avaliação enviada com sucesso!');

            console.log('Avaliação salva:', reviews[reviews.length - 1]);
        });
    }

    document.body.addEventListener('click', function (e) {

        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            e.preventDefault();
            const productData = {
                id: addToCartBtn.dataset.productId,
                title: addToCartBtn.dataset.productTitle,
                price: addToCartBtn.dataset.productPrice,
                image: addToCartBtn.dataset.productImage
            };
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            addToCart(productData, quantity);
        }

        const quantityChangeBtn = e.target.closest('.quantity-change');
        if (quantityChangeBtn) {
            changeCartQuantity(quantityChangeBtn.dataset.productId, quantityChangeBtn.dataset.op);
        }

        const removeBtn = e.target.closest('.remove-from-cart');
        if (removeBtn) {
            removeFromCart(removeBtn.dataset.productId);
        }

        const quantityOpBtn = e.target.closest('.quantity-control button');
        if (quantityOpBtn) {
            const input = quantityOpBtn.parentElement.querySelector('input');
            let value = parseInt(input.value);
            if (quantityOpBtn.dataset.op === 'plus') {
                value++;
            } else if (quantityOpBtn.dataset.op === 'minus' && value > 1) {
                value--;
            }
            input.value = value;
        }
    });

    const configScript = document.querySelector('script[data-base-url]');
    window.BASE_URL = configScript ? configScript.dataset.baseUrl : '/';

    updateAll();

    updateReviewsUI();

});

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

});
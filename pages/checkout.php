<?php
$page_title = 'Finalizar Compra - SpiritShop';
include '../includes/header.php';
$json_data = file_get_contents('../data/produtos.json');
$produtos = json_decode($json_data, true);
shuffle($produtos);
$produtos_sugeridos = array_slice($produtos, 0, 4);
?>

<div class="container my-5">
    <div class="row g-5">
        <div class="col-lg-8">
            <div class="card shadow-sm mb-4"><div class="card-body">
                <h2 class="h4 mb-4">Endereço de Entrega</h2>
                <form id="checkoutForm">
                    <div class="row g-3">
                        <div class="col-12"><label for="fullName" class="form-label">Nome Completo</label><input type="text" class="form-control" id="fullName" required></div>
                        <div class="col-12"><label for="email" class="form-label">Email</label><input type="email" class="form-control" id="email" required></div>
                        <div class="col-md-6"><label for="cep" class="form-label">CEP</label><div class="input-group"><input type="text" class="form-control" id="cep" required><button class="btn btn-outline-secondary" type="button" id="btnBuscarCep"><i class="fas fa-search"></i></button></div></div>
                        <div class="col-md-6"><label for="phone" class="form-label">Telefone</label><input type="tel" class="form-control" id="phone" required></div>
                        <div class="col-12"><label for="address" class="form-label">Endereço</label><input type="text" class="form-control" id="address" required></div>
                    </div>
                </form>
            </div></div>
        </div>
        <div class="col-lg-4">
            <div class="card shadow-sm sticky-top" style="top: 100px;">
                <div class="card-body">
                    <h2 class="h4 mb-4">Seu Pedido</h2>
                    <div id="cartItemsContainer">
                        </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-2"><span>Subtotal:</span><span id="subtotal">R$ 0,00</span></div>
                    <div class="d-flex justify-content-between mb-2"><span>Frete:</span><span id="shipping">R$ 0,00</span></div>
                    <div class="d-flex justify-content-between fw-bold fs-5"><span>Total:</span><span id="total">R$ 0,00</span></div>
                    <button type="submit" form="checkoutForm" class="btn btn-primary w-100 mt-4 py-3">Finalizar Compra</button>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-5"><div class="col-12"><h2 class="h4 mb-4">Você também pode gostar</h2><div class="row">
        <?php foreach ($produtos_sugeridos as $produto): ?>
        <div class="col-md-3 mb-4">
             <div class="card h-100 shadow-sm">
                <a href="produto.php?id=<?= $produto['id'] ?>">
                    <img src="<?= htmlspecialchars($produto['imagens'][0]) ?>" class="card-img-top" alt="<?= htmlspecialchars($produto['titulo']) ?>">
                </a>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title"><a href="produto.php?id=<?= $produto['id'] ?>" class="text-decoration-none text-dark"><?= htmlspecialchars($produto['titulo']) ?></a></h5>
                    <p class="h5 text-primary fw-bold mt-auto pt-2">R$ <?= htmlspecialchars($produto['preco']) ?></p>
                </div>
                <div class="card-footer bg-transparent border-0 p-3">
                    <button class="btn btn-sm btn-primary w-100 add-to-cart-btn"
                        data-product-id="<?= $produto['id'] ?>"
                        data-product-title="<?= htmlspecialchars($produto['titulo']) ?>"
                        data-product-price="<?= htmlspecialchars($produto['preco']) ?>"
                        data-product-image="<?= htmlspecialchars($produto['imagens'][0]) ?>">
                        <i class="fas fa-cart-plus me-2"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div></div></div>
</div>

<?php include '../includes/footer.php'; ?>
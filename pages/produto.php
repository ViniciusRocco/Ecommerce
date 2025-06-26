<?php
require_once '../includes/config.php';
if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) { header("Location: " . BASE_URL); exit; }
$produto_id = (int)$_GET['id'];
$json_data = file_get_contents('../data/produtos.json');
$produtos = json_decode($json_data, true);
$produto_selecionado = null;
foreach ($produtos as $p) { if ($p['id'] === $produto_id) { $produto_selecionado = $p; break; } }
if (!$produto_selecionado) { header("Location: " . BASE_URL); exit; }

$page_title = htmlspecialchars($produto_selecionado['titulo']) . ' - SpiritShop';
include '../includes/header.php';
?>
<div class="container my-5">
    <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="<?= BASE_URL ?>index.php">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">
                <?= htmlspecialchars($produto_selecionado['titulo']) ?></li>
        </ol>
    </nav>
    <div class="row">
        <div class="col-md-6 mb-4 mb-md-0">
            <div class="swiper product-gallery-swiper shadow-lg rounded">
                <div class="swiper-wrapper">
                    <?php if (!empty($produto_selecionado['imagens'])): foreach ($produto_selecionado['imagens'] as $imagem): ?>
                    <div class="swiper-slide"><img src="<?= htmlspecialchars($imagem) ?>" class="d-block w-100">
                    </div>
                    <?php endforeach; else: ?>
                    <div class="swiper-slide"><img src="https://placehold.co/600x400/EEE/CCC?text=Sem+Imagem"></div>
                    <?php endif; ?>
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <div class="col-md-6">
            <h1 class="display-5 fw-bold"><?= htmlspecialchars($produto_selecionado['titulo']) ?></h1>
            <p class="lead text-muted mb-4"><?= htmlspecialchars($produto_selecionado['descricao_longa']) ?></p>
            <div class="bg-light p-4 rounded mb-4">
                <p class="display-4 text-primary fw-bold mb-0">R$ <?= htmlspecialchars($produto_selecionado['preco']) ?>
                </p>
            </div>
            <div class="d-flex align-items-center gap-3 mb-3">
                <label for="quantity" class="form-label mb-0">Quantidade:</label>
                <div class="input-group quantity-control" style="width: 120px;">
                    <button class="btn btn-outline-secondary" type="button" data-op="minus">-</button>
                    <input type="text" class="form-control text-center bg-light" value="1" id="quantity" readonly>
                    <button class="btn btn-outline-secondary" type="button" data-op="plus">+</button>
                </div>
            </div>
            <button class="btn btn-primary btn-lg w-100 mb-3 add-to-cart-btn" data-product-id="<?= $produto_id ?>"
                data-product-title="<?= htmlspecialchars($produto_selecionado['titulo']) ?>"
                data-product-price="<?= htmlspecialchars($produto_selecionado['preco']) ?>"
                data-product-image="<?= htmlspecialchars($produto_selecionado['imagens'][0] ?? '') ?>">
                <i class="fas fa-cart-plus me-2"></i> Adicionar ao Carrinho
            </button>
        </div>
    </div>
    <div class="row mt-5">
        <div class="col-12">
            <div class="card shadow-sm">
                <div class="card-body">
                    <h3 class="mb-4">Avaliações</h3>
                    <div class="row">
                        <div class="col-md-4 text-center mb-4 mb-md-0">
                            <div id="averageRatingValue" class="display-3 fw-bold text-primary">0.0</div>
                            <div id="averageRatingStars" class="rating-stars justify-content-center mb-2"></div>
                            <small id="totalReviewsCount" class="text-muted">(0 avaliações)</small>
                        </div>
                        <div class="col-md-8">
                            <form id="reviewForm" class="mb-5">
                                <h5 class="mb-3">Deixe sua avaliação</h5>
                                <div class="mb-3">
                                    <label class="form-label">Sua nota</label>
                                    <div class="rating-stars-form rating-stars" data-rating="0">
                                        <?php for ($i = 1; $i <= 5; $i++): ?><i class="fas fa-star fa-lg"
                                            data-value="<?= $i ?>"></i><?php endfor; ?>
                                    </div>
                                </div>
                                <div class="mb-3"><label for="reviewName" class="form-label">Seu nome</label><input
                                        type="text" class="form-control" id="reviewName" required></div>
                                <div class="mb-3"><label for="reviewText" class="form-label">Seu
                                        comentário</label><textarea class="form-control" id="reviewText" rows="3"
                                        required></textarea></div>
                                <button type="submit" class="btn btn-primary">Enviar Avaliação</button>
                            </form>
                            <div id="reviewsList"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php include '../includes/footer.php'; ?>
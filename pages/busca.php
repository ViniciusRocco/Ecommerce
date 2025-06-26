<?php
$search_term = '';
$results = [];
if (file_exists('../includes/config.php')) {
    require_once '../includes/config.php';
}

$json_data = file_get_contents('../data/produtos.json');
$produtos = json_decode($json_data, true);

if (isset($_GET['q']) && !empty(trim($_GET['q']))) {
    $search_term = trim($_GET['q']);
    $search_lower = mb_strtolower($search_term, 'UTF-8');
    
    if (is_array($produtos)) {
        foreach ($produtos as $produto) {
            $title_lower = mb_strtolower($produto['titulo'], 'UTF-8');
            $desc_lower = mb_strtolower($produto['descricao_curta'], 'UTF-8');
            
            if (strpos($title_lower, $search_lower) !== false || 
                strpos($desc_lower, $search_lower) !== false) {
                $results[] = $produto;
            }
        }
    }
}

$page_title = 'Busca: ' . htmlspecialchars($search_term);
include '../includes/header.php';
?>

<div class="container my-5">
    <div class="row">
        <div class="col-12">
            <h1 class="h2 mb-4">Resultados da busca</h1>
            
            <?php if (!empty($search_term)): ?>
                <p class="lead text-muted mb-4">
                    <?= count($results) ?> resultado(s) para "<?= htmlspecialchars($search_term) ?>"
                </p>
            <?php endif; ?>
            
            <?php if (empty($results) && !empty($search_term)): ?>
                <div class="text-center py-5 bg-white rounded shadow-sm">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p class="text-muted mb-4">Tente usar palavras-chave diferentes ou verifique a ortografia.</p>
                    <a href="<?= BASE_URL ?>index.php" class="btn btn-primary">Voltar à loja</a>
                </div>
            <?php elseif (!empty($results)): ?>
                <div class="row">
                    <?php foreach ($results as $produto): ?>
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
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>
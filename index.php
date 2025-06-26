<?php
$json_data = file_get_contents('data/produtos.json');
$produtos = json_decode($json_data, true);

$page_title = 'SpiritShop - A sua loja de tecnologia';
include 'includes/header.php';
?>

<div class="container my-5">
    <div class="banner-promo p-5 text-center bg-white rounded-3 shadow-sm">
        <h1 class="text-primary">Promoção de Verão!</h1>
        <p class="col-lg-8 mx-auto fs-5 text-muted">
            Até <strong>40% de desconto</strong> nos melhores gadgets e acessórios. Não perca esta oportunidade!
        </p>
        <button class="btn btn-primary btn-lg px-4 rounded-pill" type="button">
            Ver Ofertas <i class="fas fa-arrow-right ms-2"></i>
        </button>
    </div>
</div>

<main class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="display-6">Mais Vendidos</h2>
        <div class="carousel-controls">
            <button class="btn btn-outline-primary" type="button" data-bs-target="#homeProductCarousel"
                data-bs-slide="prev">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="btn btn-outline-primary" type="button" data-bs-target="#homeProductCarousel"
                data-bs-slide="next">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>

    <div id="homeProductCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
        <div class="carousel-inner">
            <?php
            if (!empty($produtos)) {
                $items_per_slide = 4;
                $total_items = count($produtos);
                $total_slides = ceil($total_items / $items_per_slide);

                for ($i = 0; $i < $total_slides; $i++) {
                    $produtos_slide = array_slice($produtos, $i * $items_per_slide, $items_per_slide);
                    echo '<div class="carousel-item ' . ($i === 0 ? 'active' : '') . '"><div class="row">';
                    foreach ($produtos_slide as $produto) {
                        $image_path = htmlspecialchars($produto['imagens'][0]);
                        $product_page_path = 'pages/produto.php?id=' . $produto['id'];
                        
                        echo '<div class="col-md-3 mb-4 d-flex"><div class="card h-100 shadow-sm flex-fill">';
                        echo '<a href="' . $product_page_path . '"><img src="' . $image_path . '" class="card-img-top" alt="' . htmlspecialchars($produto['titulo']) . '"></a>';
                        echo '<div class="card-body d-flex flex-column">';
                        echo '<h5 class="card-title"><a href="' . $product_page_path . '" class="text-decoration-none text-dark">' . htmlspecialchars($produto['titulo']) . '</a></h5>';
                        echo '<p class="h5 text-primary fw-bold mt-auto pt-2">R$ ' . htmlspecialchars($produto['preco']) . '</p>';
                        echo '</div><div class="card-footer bg-transparent border-0 p-3">';
                        echo '<button class="btn btn-sm btn-primary w-100 add-to-cart-btn" data-product-id="' . $produto['id'] . '" data-product-title="' . htmlspecialchars($produto['titulo']) . '" data-product-price="' . htmlspecialchars($produto['preco']) . '" data-product-image="' . $image_path . '"><i class="fas fa-cart-plus me-2"></i> Adicionar</button>';
                        echo '</div></div></div>';
                    }
                    echo '</div></div>';
                }
            }
            ?>
        </div>
    </div>
</main>

<?php include 'includes/footer.php'; ?>
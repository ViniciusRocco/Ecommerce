<?php
if (file_exists('includes/config.php')) {
    require_once 'includes/config.php';
} else if (file_exists('../includes/config.php')) {
    require_once '../includes/config.php';
}
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page_title ?? 'SpiritShop' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/style.css">
</head>

<body class="d-flex flex-column min-vh-100">
    <header class="bg-white shadow-sm sticky-top">
        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <a class="navbar-brand" href="<?= BASE_URL ?>index.php">
                    <strong>Spirit</strong>Shop
                </a>

                <div class="d-flex align-items-center order-lg-2 gap-3">
                    <form class="d-none d-lg-flex search-form" action="<?= BASE_URL ?>pages/busca.php" method="GET">
                        <div class="input-group">
                            <input class="form-control rounded-pill-start" type="search" name="q"
                                placeholder="Buscar..." aria-label="Search">
                            <button class="btn btn-primary rounded-pill-end" type="submit"><i
                                    class="fas fa-search"></i></button>
                        </div>
                    </form>
                    <div class="d-flex gap-3">
                        <a class="nav-link" href="#"><i class="fas fa-user fs-5"></i></a>
                        <div class="nav-item dropdown">
                            <a class="nav-link position-relative" href="#" id="cartDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-shopping-cart fs-5"></i>
                                <span id="cart-count-badge"
                                    class="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle" style="display: none;">0</span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end p-0" id="miniCartDropdown"
                                style="min-width: 380px;"></div>
                        </div>
                    </div>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"><span class="navbar-toggler-icon"></span></button>
                </div>
                <div class="collapse navbar-collapse order-lg-1" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="<?= BASE_URL ?>index.php">Home</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <main class="flex-shrink-0">
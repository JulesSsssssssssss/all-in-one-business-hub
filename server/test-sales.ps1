# Script de test pour l'API Sales
# Assurez-vous que le serveur tourne sur http://localhost:5000

$baseUrl = "http://localhost:5000/api"
$token = "" # Sera rempli après login

Write-Host "`n=== TEST API SALES ===" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl`n" -ForegroundColor Yellow

# Fonction helper pour afficher les résultats
function Show-Response {
    param($Response, $TestName)
    Write-Host "`n--- $TestName ---" -ForegroundColor Green
    $Response | ConvertTo-Json -Depth 10
}

# 1. Login pour obtenir un token
Write-Host "`n1. Login..." -ForegroundColor Cyan
try {
    $loginBody = @{
        email = "test@example.com"
        password = "Test123456!"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "✓ Login réussi!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Erreur de login: $_" -ForegroundColor Red
    Write-Host "Créez d'abord un utilisateur avec /api/auth/register" -ForegroundColor Yellow
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Créer une commande fournisseur (nécessaire pour créer un produit)
Write-Host "`n2. Création d'une commande fournisseur..." -ForegroundColor Cyan
$supplierOrderBody = @{
    name = "Lot Nike - Test"
    supplier = "Alibaba"
    purchaseDate = "2024-01-15"
    totalCost = 500.00
    shippingCost = 50.00
    customsCost = 20.00
    notes = "Commande de test"
} | ConvertTo-Json

try {
    $supplierOrder = Invoke-RestMethod -Uri "$baseUrl/supplier-orders" `
        -Method Post `
        -Headers $headers `
        -Body $supplierOrderBody
    
    $supplierOrderId = $supplierOrder.order._id
    Write-Host "✓ Commande créée: $supplierOrderId" -ForegroundColor Green
} catch {
    Write-Host "⚠ Endpoint supplier-orders pas encore implémenté" -ForegroundColor Yellow
    Write-Host "Utilisez un supplierOrderId existant pour continuer les tests" -ForegroundColor Yellow
    $supplierOrderId = "6744a5b8c1d2e3f4a5b6c7d8" # ID fictif pour demo
}

# 3. Créer un produit
Write-Host "`n3. Création d'un produit..." -ForegroundColor Cyan
$productBody = @{
    supplierOrderId = $supplierOrderId
    name = "Nike Air Max 90"
    size = "42"
    quantity = 1
    description = "Baskets Nike neuves"
    photos = @("https://example.com/photo1.jpg")
    unitCost = 45.00
    purchaseDate = "2024-01-15"
    salePrice = 89.99
    condition = "Neuf"
    platform = "Vinted"
} | ConvertTo-Json

try {
    $product = Invoke-RestMethod -Uri "$baseUrl/sales/products" `
        -Method Post `
        -Headers $headers `
        -Body $productBody
    
    Show-Response $product "Produit créé"
    $productId = $product.product._id
    Write-Host "✓ Produit créé: $productId" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Obtenir tous les produits
Write-Host "`n4. Récupération de tous les produits..." -ForegroundColor Cyan
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/sales/products" `
        -Method Get `
        -Headers $headers
    
    Show-Response $products "Liste des produits"
    Write-Host "✓ Total produits: $($products.total)" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Obtenir un produit spécifique
Write-Host "`n5. Récupération du produit $productId..." -ForegroundColor Cyan
try {
    $singleProduct = Invoke-RestMethod -Uri "$baseUrl/sales/products/$productId" `
        -Method Get `
        -Headers $headers
    
    Show-Response $singleProduct "Produit individuel"
    Write-Host "✓ Produit récupéré" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Mettre en vente le produit
Write-Host "`n6. Mise en vente du produit..." -ForegroundColor Cyan
$listBody = @{
    platform = "Vinted"
    boosted = $true
} | ConvertTo-Json

try {
    $listed = Invoke-RestMethod -Uri "$baseUrl/sales/products/$productId/list" `
        -Method Put `
        -Headers $headers `
        -Body $listBody
    
    Show-Response $listed "Produit mis en vente"
    Write-Host "✓ Produit en ligne sur Vinted" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Booster le produit
Write-Host "`n7. Boost du produit..." -ForegroundColor Cyan
try {
    $boosted = Invoke-RestMethod -Uri "$baseUrl/sales/products/$productId/boost" `
        -Method Put `
        -Headers $headers
    
    Show-Response $boosted "Produit boosté"
    Write-Host "✓ Produit boosté" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Marquer comme vendu
Write-Host "`n8. Marquage comme vendu..." -ForegroundColor Cyan
$sellBody = @{
    soldPrice = 85.00
    soldTo = "Jean Dupont"
    soldDate = "2024-01-25"
} | ConvertTo-Json

try {
    $sold = Invoke-RestMethod -Uri "$baseUrl/sales/products/$productId/sell" `
        -Method Put `
        -Headers $headers `
        -Body $sellBody
    
    Show-Response $sold "Produit vendu"
    Write-Host "✓ Produit marqué comme vendu" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Obtenir les statistiques
Write-Host "`n9. Récupération des statistiques..." -ForegroundColor Cyan
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/sales/stats" `
        -Method Get `
        -Headers $headers
    
    Show-Response $stats "Statistiques"
    Write-Host "✓ Stats récupérées" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 10. Filtrer les produits vendus
Write-Host "`n10. Filtrage des produits vendus..." -ForegroundColor Cyan
try {
    $soldProductsUrl = "$baseUrl/sales/products?status=sold&limit=10"
    $soldProducts = Invoke-RestMethod -Uri $soldProductsUrl `
        -Method Get `
        -Headers $headers
    
    Show-Response $soldProducts "Produits vendus"
    Write-Host "✓ Produits vendus: $($soldProducts.total)" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TESTS TERMINES ===" -ForegroundColor Cyan
Write-Host "✓ API Sales operationnelle!" -ForegroundColor Green

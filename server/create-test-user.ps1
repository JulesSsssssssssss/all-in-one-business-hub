# Script pour créer un utilisateur de test
$baseUrl = "http://localhost:5000/api"

Write-Host "`n=== CREATION UTILISATEUR TEST ===" -ForegroundColor Cyan

# 1. Créer un utilisateur
Write-Host "`n1. Création d'un utilisateur..." -ForegroundColor Yellow

$registerBody = @{
    email = "test@example.com"
    password = "Test123456!"
    name = "Utilisateur Test"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/sign-up/email" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json"
    
    Write-Host "✓ Utilisateur créé avec succès!" -ForegroundColor Green
    $registerResponse | ConvertTo-Json -Depth 5
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "ℹ Utilisateur existe déjà, continuons..." -ForegroundColor Yellow
    } else {
        Write-Host "✗ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host $_.Exception.Response -ForegroundColor Red
    }
}

# 2. Se connecter
Write-Host "`n2. Connexion..." -ForegroundColor Yellow

$loginBody = @{
    email = "test@example.com"
    password = "Test123456!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/sign-in/email" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    
    Write-Host "✓ Connexion réussie!" -ForegroundColor Green
    
    if ($loginResponse.token) {
        Write-Host "`nToken JWT: $($loginResponse.token.Substring(0, 50))..." -ForegroundColor Cyan
        Write-Host "`nCopiez ce token pour les tests:" -ForegroundColor Yellow
        Write-Host $loginResponse.token -ForegroundColor White
    } else {
        Write-Host "`nRéponse complète:" -ForegroundColor Cyan
        $loginResponse | ConvertTo-Json -Depth 5
    }
} catch {
    Write-Host "✗ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__ -ForegroundColor Red
}

Write-Host "`n=== TERMINE ===" -ForegroundColor Cyan

# Script pour tester toutes les routes d'authentification
# Ce script doit être exécuté pendant que le serveur tourne

$ErrorActionPreference = "Continue"

Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║       Test des Routes d'Authentification Better Auth        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Variables de test
$baseUrl = "http://localhost:5000"
$testEmail = "demo$(Get-Random -Minimum 1000 -Maximum 9999)@example.com"
$testPassword = "Demo1234"
$testName = "Demo User"

# Compteur de succès
$testsTotal = 0
$testsSuccess = 0

# ============================================
# Test 1: Health Check
# ============================================
$testsTotal++
Write-Host "`n[1/5] Test Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ SUCCÈS - Serveur accessible" -ForegroundColor Green
    Write-Host "   Status: $($response.statusCode)" -ForegroundColor Gray
    $testsSuccess++
} catch {
    Write-Host "❌ ÉCHEC - Le serveur ne répond pas" -ForegroundColor Red
    Write-Host "   Assurez-vous que le serveur tourne avec: npm run dev" -ForegroundColor Yellow
    exit 1
}

# ============================================
# Test 2: Sign Up (Inscription)
# ============================================
$testsTotal++
Write-Host "`n[2/5] Test Sign Up (Inscription)..." -ForegroundColor Yellow
Write-Host "   Email: $testEmail" -ForegroundColor Gray
Write-Host "   Password: $testPassword" -ForegroundColor Gray

$signUpBody = @{
    email = $testEmail
    password = $testPassword
    name = $testName
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/sign-up/email" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signUpBody `
        -TimeoutSec 10
    
    Write-Host "✅ SUCCÈS - Utilisateur créé" -ForegroundColor Green
    Write-Host "   User ID: $($response.user.id)" -ForegroundColor Gray
    Write-Host "   Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "   Name: $($response.user.name)" -ForegroundColor Gray
    $testsSuccess++
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "⚠️ ATTENTION - L'utilisateur existe déjà (normal si déjà testé)" -ForegroundColor Yellow
        # Utiliser un email existant pour les tests suivants
        $testEmail = "demo@example.com"
    } else {
        Write-Host "❌ ÉCHEC - Erreur lors de l'inscription" -ForegroundColor Red
        Write-Host "   Code: $statusCode" -ForegroundColor Red
    }
}

# ============================================
# Test 3: Sign In (Connexion)
# ============================================
$testsTotal++
Write-Host "`n[3/5] Test Sign In (Connexion)..." -ForegroundColor Yellow

$signInBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/sign-in/email" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signInBody `
        -SessionVariable session `
        -TimeoutSec 10
    
    Write-Host "✅ SUCCÈS - Connexion réussie" -ForegroundColor Green
    Write-Host "   User ID: $($response.user.id)" -ForegroundColor Gray
    Write-Host "   Email: $($response.user.email)" -ForegroundColor Gray
    
    $cookies = $session.Cookies.GetCookies($baseUrl)
    Write-Host "   Cookies: $($cookies.Count) cookie(s) de session" -ForegroundColor Gray
    $testsSuccess++
    
    $sessionActive = $true
} catch {
    Write-Host "❌ ÉCHEC - Erreur lors de la connexion" -ForegroundColor Red
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   Code: $statusCode" -ForegroundColor Red
    $sessionActive = $false
}

# ============================================
# Test 4: Get Session
# ============================================
if ($sessionActive) {
    $testsTotal++
    Write-Host "`n[4/5] Test Get Session (Récupérer la session)..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/get-session" `
            -Method GET `
            -WebSession $session `
            -TimeoutSec 10
        
        Write-Host "✅ SUCCÈS - Session récupérée" -ForegroundColor Green
        Write-Host "   User ID: $($response.user.id)" -ForegroundColor Gray
        Write-Host "   Session ID: $($response.session.id)" -ForegroundColor Gray
        Write-Host "   Expire: $($response.session.expiresAt)" -ForegroundColor Gray
        $testsSuccess++
    } catch {
        Write-Host "❌ ÉCHEC - Impossible de récupérer la session" -ForegroundColor Red
    }
}

# ============================================
# Test 5: Sign Out (Déconnexion)
# ============================================
if ($sessionActive) {
    $testsTotal++
    Write-Host "`n[5/5] Test Sign Out (Déconnexion)..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/sign-out" `
            -Method POST `
            -WebSession $session `
            -TimeoutSec 10
        
        Write-Host "✅ SUCCÈS - Déconnexion réussie" -ForegroundColor Green
        $testsSuccess++
    } catch {
        Write-Host "❌ ÉCHEC - Erreur lors de la déconnexion" -ForegroundColor Red
    }
}

# ============================================
# Résumé
# ============================================
Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                      RÉSUMÉ DES TESTS                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

$successRate = [math]::Round(($testsSuccess / $testsTotal) * 100, 0)

if ($testsSuccess -eq $testsTotal) {
    Write-Host "   🎉 TOUS LES TESTS ONT RÉUSSI ! 🎉" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ CERTAINS TESTS ONT ÉCHOUÉ" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "   Total: $testsTotal tests" -ForegroundColor White
Write-Host "   Succès: $testsSuccess tests" -ForegroundColor Green
Write-Host "   Échecs: $($testsTotal - $testsSuccess) tests" -ForegroundColor $(if ($testsTotal -eq $testsSuccess) { "Green" } else { "Red" })
Write-Host "   Taux de réussite: $successRate%" -ForegroundColor $(if ($successRate -eq 100) { "Green" } else { "Yellow" })
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($testsSuccess -eq $testsTotal) {
    Write-Host "✅ L'authentification Better Auth fonctionne parfaitement !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "  1. Configurer le frontend (voir AUTH_SETUP_COMPLETE.md)" -ForegroundColor Gray
    Write-Host "  2. Protéger les routes backend avec requireAuth()" -ForegroundColor Gray
    Write-Host "  3. Tester l'intégration complète frontend-backend" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "Pour plus d'informations, consultez:" -ForegroundColor Yellow
    Write-Host "  - server/TEST_AUTH.md" -ForegroundColor Gray
    Write-Host "  - docs/AUTHENTICATION.md" -ForegroundColor Gray
    Write-Host ""
}

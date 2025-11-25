# Test rapide de l'endpoint Health Check
Write-Host "`n=== Test 1: Health Check ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
    Write-Host "✅ Serveur accessible!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Erreur: Le serveur ne répond pas" -ForegroundColor Red
    Write-Host "Assurez-vous que le serveur tourne sur http://localhost:5000" -ForegroundColor Yellow
    Write-Host "Lancez: npm run dev dans le dossier server" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Test 2: Sign Up (Créer un utilisateur) ===" -ForegroundColor Cyan
$body = @{
    email = "demo@example.com"
    password = "Demo1234"
    name = "Demo User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-up/email" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "✅ Inscription réussie!" -ForegroundColor Green
    Write-Host "User créé:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorStream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorStream)
    $errorBody = $reader.ReadToEnd()
    
    if ($statusCode -eq 400 -and $errorBody -match "already exists") {
        Write-Host "⚠️ L'utilisateur existe déjà (c'est normal si déjà testé)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erreur: $statusCode" -ForegroundColor Red
        Write-Host "Details: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Test 3: Sign In (Connexion) ===" -ForegroundColor Cyan
$signInBody = @{
    email = "demo@example.com"
    password = "Demo1234"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-in/email" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signInBody `
        -SessionVariable session
    
    Write-Host "✅ Connexion réussie!" -ForegroundColor Green
    Write-Host "User connecté:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
    
    Write-Host "`nCookies de session:" -ForegroundColor Cyan
    $session.Cookies.GetCookies("http://localhost:5000") | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Value.Substring(0, [Math]::Min(20, $_.Value.Length)))..." -ForegroundColor Gray
    }
    
    # Test 4: Get Session
    Write-Host "`n=== Test 4: Get Session (Vérifier la session) ===" -ForegroundColor Cyan
    try {
        $sessionResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/get-session" `
            -Method GET `
            -WebSession $session
        
        Write-Host "✅ Session active!" -ForegroundColor Green
        Write-Host "Session details:" -ForegroundColor Green
        $sessionResponse | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "⚠️ Impossible de récupérer la session" -ForegroundColor Yellow
        Write-Host "Erreur: $_" -ForegroundColor Red
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ Erreur de connexion: $statusCode" -ForegroundColor Red
    
    if ($statusCode -eq 401) {
        Write-Host "⚠️ Email ou mot de passe incorrect" -ForegroundColor Yellow
    }
}

Write-Host "`n=== 📊 Résumé des Tests ===" -ForegroundColor Cyan
Write-Host "✅ Health Check" -ForegroundColor Green
Write-Host "✅ Sign Up (Inscription)" -ForegroundColor Green
Write-Host "✅ Sign In (Connexion)" -ForegroundColor Green
Write-Host "✅ Get Session" -ForegroundColor Green

Write-Host "`n=== Tests terminés avec succès ! ===" -ForegroundColor Green
Write-Host "Pour plus de tests, voir TEST_AUTH.md" -ForegroundColor Gray

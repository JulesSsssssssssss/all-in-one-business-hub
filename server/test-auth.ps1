# Script PowerShell pour tester les endpoints d'authentification

Write-Host "`n=== Test 1: Health Check ===" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor Green
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
}

Write-Host "`n=== Test 2: Sign Up (Inscription) ===" -ForegroundColor Cyan
$signUpBody = @{
    email = "test@example.com"
    password = "Test1234"
    name = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/sign-up/email" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signUpBody
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor Green
    
    # Sauvegarder les cookies pour les prochains tests
    $global:session = $response
} catch {
    $errorResponse = $_.Exception.Response
    if ($errorResponse) {
        $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Status: $($errorResponse.StatusCode)" -ForegroundColor Yellow
        Write-Host "Response: $responseBody`n" -ForegroundColor Yellow
    } else {
        Write-Host "Erreur: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== Test 3: Sign In (Connexion) ===" -ForegroundColor Cyan
$signInBody = @{
    email = "test@example.com"
    password = "Test1234"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/sign-in/email" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signInBody `
        -SessionVariable session
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor Green
    
    # Afficher les cookies de session
    Write-Host "Cookies:" -ForegroundColor Cyan
    $session.Cookies.GetCookies("http://localhost:5000") | ForEach-Object {
        Write-Host "  $($_.Name) = $($_.Value)" -ForegroundColor Gray
    }
} catch {
    $errorResponse = $_.Exception.Response
    if ($errorResponse) {
        $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Status: $($errorResponse.StatusCode)" -ForegroundColor Yellow
        Write-Host "Response: $responseBody`n" -ForegroundColor Yellow
    } else {
        Write-Host "Erreur: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== Test 4: Get Session ===" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/get-session" `
        -Method GET `
        -WebSession $session
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor Green
} catch {
    $errorResponse = $_.Exception.Response
    if ($errorResponse) {
        $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Status: $($errorResponse.StatusCode)" -ForegroundColor Yellow
        Write-Host "Response: $responseBody`n" -ForegroundColor Yellow
    } else {
        Write-Host "Erreur: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== Tests terminés ===" -ForegroundColor Cyan

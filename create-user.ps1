# Script pour créer un utilisateur de test
Write-Host "`n=== CREATION UTILISATEUR TEST ===" -ForegroundColor Cyan

$body = @{
    email = "test@example.com"
    password = "Test123456!"
    name = "Test User"
} | ConvertTo-Json

Write-Host "`nCréation de l'utilisateur..." -ForegroundColor Yellow
Write-Host "Email: test@example.com" -ForegroundColor White
Write-Host "Password: Test123456!" -ForegroundColor White

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-up/email" `
        -Method Post `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "`n✓ Utilisateur créé avec succès!" -ForegroundColor Green
    Write-Host "`nVous pouvez maintenant vous connecter sur:" -ForegroundColor Cyan
    Write-Host "http://localhost:3000/auth/login" -ForegroundColor White
    Write-Host "`nAvec les identifiants:" -ForegroundColor Cyan
    Write-Host "Email: test@example.com" -ForegroundColor White
    Write-Host "Password: Test123456!" -ForegroundColor White
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 400) {
        Write-Host "`nℹ L'utilisateur existe déjà!" -ForegroundColor Yellow
        Write-Host "`nConnectez-vous sur:" -ForegroundColor Cyan
        Write-Host "http://localhost:3000/auth/login" -ForegroundColor White
        Write-Host "`nAvec les identifiants:" -ForegroundColor Cyan
        Write-Host "Email: test@example.com" -ForegroundColor White
        Write-Host "Password: Test123456!" -ForegroundColor White
    } else {
        Write-Host "`n✗ Erreur lors de la creation:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        
        # Verifier si le serveur est accessible
        try {
            $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction Stop
            Write-Host "`n✓ Le serveur est accessible" -ForegroundColor Green
        } catch {
            Write-Host "`n✗ Le serveur n'est pas accessible" -ForegroundColor Red
            Write-Host "Assurez-vous que le serveur backend est demarre:" -ForegroundColor Yellow
            Write-Host "cd server" -ForegroundColor White
            Write-Host "npm run dev" -ForegroundColor White
        }
    }
}

Write-Host "`n=== FIN ===" -ForegroundColor Cyan

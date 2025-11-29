# Creer un utilisateur de test
Write-Host "Creation utilisateur..." -ForegroundColor Cyan

$body = '{"email":"test@example.com","password":"Test123456!","name":"Test User"}'

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/sign-up/email" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Utilisateur cree avec succes!" -ForegroundColor Green
} catch {
    Write-Host "L'utilisateur existe deja" -ForegroundColor Yellow
}

Write-Host "`nConnectez-vous avec:" -ForegroundColor Cyan
Write-Host "Email: test@example.com"
Write-Host "Password: Test123456!"

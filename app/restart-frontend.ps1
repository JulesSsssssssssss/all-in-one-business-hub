# Script pour redémarrer le frontend Next.js
Write-Host "`n🔄 Redémarrage du frontend Next.js..." -ForegroundColor Cyan

# Arrêter les processus Node existants sur le port 3000
$port = 3000
$processIds = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique

if ($processIds) {
    Write-Host "⏹️ Arrêt des processus sur le port $port..." -ForegroundColor Yellow
    foreach ($pid in $processIds) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "   ✅ Process $pid arrêté" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️ Impossible d'arrêter le process $pid" -ForegroundColor Yellow
        }
    }
    Start-Sleep -Seconds 2
}

# Démarrer le frontend
Write-Host "`n🚀 Démarrage du frontend..." -ForegroundColor Cyan
Set-Location "C:\Users\Utilisateur\Documents\Application\app"

Write-Host "`n📝 Variables d'environnement chargées:" -ForegroundColor Gray
Get-Content .env.local | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }

Write-Host "`n▶️ Lancement de npm run dev..." -ForegroundColor Cyan
npm run dev

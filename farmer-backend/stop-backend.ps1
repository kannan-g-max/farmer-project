$listeners = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue

if (-not $listeners) {
    Write-Host "Port 8080 is already free."
    exit 0
}

$listeners |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object {
        $process = Get-Process -Id $_ -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Stopping PID $($_): $($process.ProcessName)"
            Stop-Process -Id $_ -Force
        }
    }

Start-Sleep -Seconds 2
$remaining = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($remaining) {
    Write-Host "Port 8080 is still busy."
    exit 1
}

Write-Host "Port 8080 is free."

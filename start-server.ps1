# Servidor HTTP simple para desarrollo local
$port = 8080
$url = "http://localhost:$port/"

Write-Host "Iniciando servidor en $url" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Crear un listener HTTP
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "Servidor iniciado en $url" -ForegroundColor Green
Write-Host "Abre tu navegador en: $url" -ForegroundColor Cyan
Write-Host ""

# Función para obtener el tipo MIME
function Get-MimeType {
    param($file)
    $ext = [System.IO.Path]::GetExtension($file).ToLower()
    $mimeTypes = @{
        '.html' = 'text/html; charset=utf-8'
        '.js' = 'application/javascript; charset=utf-8'
        '.css' = 'text/css; charset=utf-8'
        '.json' = 'application/json; charset=utf-8'
        '.png' = 'image/png'
        '.jpg' = 'image/jpeg'
        '.jpeg' = 'image/jpeg'
        '.gif' = 'image/gif'
        '.svg' = 'image/svg+xml'
        '.ico' = 'image/x-icon'
    }
    return $mimeTypes[$ext] ?? 'application/octet-stream'
}

# Manejar solicitudes
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq '/') {
        $localPath = '/index.html'
    }
    
    $filePath = Join-Path $PSScriptRoot $localPath.TrimStart('/')
    
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $mimeType = Get-MimeType $filePath
        $response.ContentType = $mimeType
        $response.ContentLength64 = $content.Length
        $response.StatusCode = 200
        $response.OutputStream.Write($content, 0, $content.Length)
        Write-Host "$($request.HttpMethod) $localPath - 200" -ForegroundColor Green
    } else {
        $response.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - Archivo no encontrado")
        $response.ContentLength64 = $notFound.Length
        $response.OutputStream.Write($notFound, 0, $notFound.Length)
        Write-Host "$($request.HttpMethod) $localPath - 404" -ForegroundColor Red
    }
    
    $response.Close()
}

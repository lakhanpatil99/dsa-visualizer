Add-Type -AssemblyName System.Drawing

$sourcePath = (Resolve-Path "public\web app.png").Path
$srcBmp = New-Object System.Drawing.Bitmap($sourcePath)

Write-Host "Source image size: $($srcBmp.Width) x $($srcBmp.Height)"

# Create a 1:1 square master image (361 x 361) with the source background color
$squareSize = [Math]::Max($srcBmp.Width, $srcBmp.Height)
$masterBmp = New-Object System.Drawing.Bitmap($squareSize, $squareSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$masterG = [System.Drawing.Graphics]::FromImage($masterBmp)

$bgColor = [System.Drawing.Color]::FromArgb(255, 248, 243, 237)
$masterG.Clear($bgColor)

$offsetX = [int](($squareSize - $srcBmp.Width) / 2)
$offsetY = [int](($squareSize - $srcBmp.Height) / 2)

$masterG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$masterG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$masterG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$masterG.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$masterG.DrawImage($srcBmp, $offsetX, $offsetY, $srcBmp.Width, $srcBmp.Height)
$masterG.Dispose()
$srcBmp.Dispose()

Write-Host "Master square image created: $squareSize x $squareSize"

function Resize-And-Save($src, $size, $destPath) {
    $targetBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($targetBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $g.DrawImage($src, 0, 0, $size, $size)
    $g.Dispose()
    
    $targetBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetBmp.Dispose()
    Write-Host "Saved: $destPath ($size x $size)"
}

Resize-And-Save $masterBmp 512 "public\favicon-512.png"
Resize-And-Save $masterBmp 512 "public\logo512.png"
Resize-And-Save $masterBmp 192 "public\favicon-192.png"
Resize-And-Save $masterBmp 192 "public\logo192.png"
Resize-And-Save $masterBmp 180 "public\apple-touch-icon.png"
Resize-And-Save $masterBmp 96  "public\favicon-96.png"
Resize-And-Save $masterBmp 96  "public\favicon.png"
Resize-And-Save $masterBmp 48  "public\favicon-48.png"
Resize-And-Save $masterBmp 32  "public\favicon-32.png"
Resize-And-Save $masterBmp 16  "public\favicon-16.png"

$masterBmp.Dispose()

Write-Host "All individual PNG sizes generated successfully."

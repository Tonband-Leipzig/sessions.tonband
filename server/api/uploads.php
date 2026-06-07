<?php
/**
 * Uploads API Endpoint
 *
 * Currently supports uploading tool thumbnails.
 */

require_once 'config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function createImageResource($path, $mime) {
    if ($mime === 'image/png') return @imagecreatefrompng($path);
    if ($mime === 'image/jpeg') return @imagecreatefromjpeg($path);
    if ($mime === 'image/webp' && function_exists('imagecreatefromwebp')) return @imagecreatefromwebp($path);
    return false;
}

function saveJpeg($im, $path, $quality = 82) {
    return @imagejpeg($im, $path, $quality);
}

function saveWebp($im, $path, $quality = 82) {
    if (!function_exists('imagewebp')) return false;
    return @imagewebp($im, $path, $quality);
}

function resizeCropTo($srcIm, $srcW, $srcH, $dstW, $dstH) {
    $srcRatio = $srcW / $srcH;
    $dstRatio = $dstW / $dstH;

    if ($srcRatio > $dstRatio) {
        // source is wider
        $newH = $srcH;
        $newW = (int)round($srcH * $dstRatio);
        $srcX = (int)round(($srcW - $newW) / 2);
        $srcY = 0;
    } else {
        // source is taller
        $newW = $srcW;
        $newH = (int)round($srcW / $dstRatio);
        $srcX = 0;
        $srcY = (int)round(($srcH - $newH) / 2);
    }

    $dstIm = imagecreatetruecolor($dstW, $dstH);
    imagealphablending($dstIm, false);
    imagesavealpha($dstIm, true);

    imagecopyresampled($dstIm, $srcIm, 0, 0, $srcX, $srcY, $dstW, $dstH, $newW, $newH);
    return $dstIm;
}

function getBaseUploadsUrl() {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? '';

    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    $scriptDir = rtrim($scriptDir, '/');

    // /.../server/api -> /.../server
    $serverDir = preg_replace('#/api$#', '', $scriptDir);

    if ($host === '') {
        return $serverDir . '/uploads';
    }

    return $scheme . '://' . $host . $serverDir . '/uploads';
}

switch ($action) {
    case 'thumbnail':
        requireAuth();

        if (!isset($_FILES['file'])) {
            jsonError('No file uploaded', 400);
        }

        $file = $_FILES['file'];

        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            jsonError('Upload failed', 400);
        }

        $maxBytes = 15 * 1024 * 1024; // 15MB
        $size = isset($file['size']) ? (int)$file['size'] : 0;
        if ($size <= 0 || $size > $maxBytes) {
            jsonError('File is too large (max 15MB)', 400);
        }

        $tmpName = $file['tmp_name'] ?? '';
        if ($tmpName === '' || !is_uploaded_file($tmpName)) {
            jsonError('Invalid upload', 400);
        }

        $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : null;
        $mime = $finfo ? finfo_file($finfo, $tmpName) : '';
        if ($finfo) finfo_close($finfo);

        $ext = '';
        if ($mime === 'image/png') $ext = 'png';
        if ($mime === 'image/jpeg') $ext = 'jpg';
        if ($mime === 'image/webp') $ext = 'webp';

        if ($ext === '') {
            jsonError('Unsupported file type (allowed: png, jpg, webp)', 400);
        }

        global $CONFIG;
        $uploadsRoot = rtrim($CONFIG['uploads_dir'], '/\\');
        $fullDir = $uploadsRoot . '/thumbnails';
        $previewDir = $uploadsRoot . '/thumbnails_preview';

        if (!is_dir($fullDir)) {
            if (!mkdir($fullDir, 0755, true)) {
                jsonError('Failed to create upload directory', 500);
            }
        }

        if (!is_dir($previewDir)) {
            if (!mkdir($previewDir, 0755, true)) {
                jsonError('Failed to create upload directory', 500);
            }
        }

        $base = generateUUID();
        $fullFilename = $base . '.' . $ext;
        $fullPath = $fullDir . '/' . $fullFilename;

        if (!move_uploaded_file($tmpName, $fullPath)) {
            jsonError('Failed to save uploaded file', 500);
        }

        $baseUrl = getBaseUploadsUrl();
        $fullUrl = $baseUrl . '/thumbnails/' . $fullFilename;

        // Generate preview (16:9) for card thumbnails
        $previewUrl = null;
        $previewFilename = null;
        $previewPath = null;

        if (function_exists('imagecreatetruecolor')) {
            $srcIm = createImageResource($fullPath, $mime);
            if ($srcIm !== false) {
                $srcW = imagesx($srcIm);
                $srcH = imagesy($srcIm);

                $dstW = 320;
                $dstH = 180;
                $dstIm = resizeCropTo($srcIm, $srcW, $srcH, $dstW, $dstH);

                $previewExt = function_exists('imagewebp') ? 'webp' : 'jpg';
                $previewFilename = $base . '.' . $previewExt;
                $previewPath = $previewDir . '/' . $previewFilename;

                $saved = false;
                if ($previewExt === 'webp') {
                    $saved = saveWebp($dstIm, $previewPath, 82);
                } else {
                    $saved = saveJpeg($dstIm, $previewPath, 82);
                }

                imagedestroy($dstIm);
                imagedestroy($srcIm);

                if ($saved) {
                    $previewUrl = $baseUrl . '/thumbnails_preview/' . $previewFilename;
                }
            }
        }

        // Fallback: if we couldn't create a resized preview (e.g. missing GD), still create a preview file.
        // This guarantees: two files exist (full + preview), and the UI can always use preview for the card.
        if ($previewUrl === null) {
            $previewFilename = $base . '.' . $ext;
            $previewPath = $previewDir . '/' . $previewFilename;
            if (@copy($fullPath, $previewPath)) {
                $previewUrl = $baseUrl . '/thumbnails_preview/' . $previewFilename;
            } else {
                // As a last resort, fall back to the full URL (still works, but not optimal)
                $previewUrl = $fullUrl;
            }
        }

        jsonResponse(array(
            'success' => true,
            // Backward compatibility: url is the preview
            'url' => $previewUrl,
            'preview_url' => $previewUrl,
            'full_url' => $fullUrl,
        ));

    default:
        jsonError('Not found', 404);
}

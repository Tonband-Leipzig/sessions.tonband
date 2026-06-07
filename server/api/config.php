<?php
/**
 * Server API Configuration
 * 
 * This file contains the server-side configuration for the sessions.tonband app.
 * It handles auth, data paths, and CORS headers.
 */

// Prevent direct access
if (basename($_SERVER['PHP_SELF']) === 'config.php') {
    http_response_code(403);
    die('Forbidden');
}

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', '1');

// CORS Configuration
$ALLOWED_ORIGINS = [
    'https://tonbandleipzig.de',
    'https://tonbandleipzig.de.w01fc61e.kasserver.com',
    'https://tonbandleipzig',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'null', // For local file:// testing
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Vary: Origin');

$originAllowed = false;
if ($origin !== '' && in_array($origin, $ALLOWED_ORIGINS)) {
    $originAllowed = true;
}

// Allow Vercel preview/production domains without having to hardcode each one
if (!$originAllowed && $origin !== '' && preg_match('/^https:\/\/([a-z0-9-]+\.)?vercel\.app$/i', $origin)) {
    $originAllowed = true;
}

if ($originAllowed) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    // If the request is same-origin (no Origin header), allow the canonical origin.
    // If Origin is present but not allowed, do NOT send a mismatching Allow-Origin header.
    if ($origin === '') {
        header('Access-Control-Allow-Origin: https://tonbandleipzig.de');
    }
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuration
$CONFIG = [
    // Admin credentials (change these in production!)
    // Password hash: generate with password_hash('your_password', PASSWORD_DEFAULT)
    'admin_username' => 'admin',
    'admin_password' => '$2y$12$DmPxxIGFvUY2qJa0hrVa2OBmgHua99kkqPiN4sqFYmXgnTTxNBLyy',
    
    // JWT-like simple token secret (change this in production!)
    'token_secret'   => 'change-this-secret-in-production-2026',
    'token_expire'   => 3600 * 24, // 24 hours
    
    // Data paths
    'data_dir'       => __DIR__ . '/../data/',
    'tools_file'     => __DIR__ . '/../data/tools.json',
    'uploads_dir'    => __DIR__ . '/../uploads/',
];

// Ensure data directory exists
if (!is_dir($CONFIG['data_dir'])) {
    mkdir($CONFIG['data_dir'], 0755, true);
}

// Ensure tools.json exists
if (!file_exists($CONFIG['tools_file'])) {
    file_put_contents($CONFIG['tools_file'], json_encode(['tools' => []], JSON_PRETTY_PRINT));
}

// Utility functions
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit;
}

function jsonError($message, $code = 400) {
    jsonResponse(['success' => false, 'error' => $message], $code);
}

function getJsonBody() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        jsonError('Invalid JSON body', 400);
    }
    return $data;
}

function getBearerToken() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
        return $matches[1];
    }
    return null;
}

function generateToken($payload) {
    global $CONFIG;
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload['exp'] = time() + $CONFIG['token_expire'];
    $payload['iat'] = time();
    $payloadB64 = json_encode($payload);
    
    $headerB64 = rtrim(strtr(base64_encode($header), '+/', '-_'), '=');
    $payloadB64 = rtrim(strtr(base64_encode($payloadB64), '+/', '-_'), '=');
    
    $signature = hash_hmac('sha256', "$headerB64.$payloadB64", $CONFIG['token_secret'], true);
    $signatureB64 = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    
    return "$headerB64.$payloadB64.$signatureB64";
}

function verifyToken($token) {
    global $CONFIG;
    if (!$token) return false;
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    
    list($headerB64, $payloadB64, $signatureB64) = $parts;
    
    $signature = base64_decode(strtr($signatureB64, '-_', '+/') . str_repeat('=', (4 - strlen($signatureB64) % 4) % 4));
    $expected = hash_hmac('sha256', "$headerB64.$payloadB64", $CONFIG['token_secret'], true);
    
    if (!hash_equals($expected, $signature)) return false;
    
    $payload = json_decode(base64_decode(strtr($payloadB64, '-_', '+/') . str_repeat('=', (4 - strlen($payloadB64) % 4) % 4)), true);
    if (!$payload || ($payload['exp'] ?? 0) < time()) return false;
    
    return $payload;
}

function requireAuth() {
    $token = getBearerToken();
    $payload = verifyToken($token);
    if (!$payload) {
        jsonError('Unauthorized', 401);
    }
    return $payload;
}

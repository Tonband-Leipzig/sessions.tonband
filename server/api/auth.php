<?php
/**
 * Auth API Endpoint
 * 
 * POST /auth.php - Login (returns token)
 * POST /auth.php?action=logout - Logout (client-side only, token invalidation not implemented)
 * GET  /auth.php?action=verify - Verify token validity
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'login';

// Only POST for login
if ($method !== 'POST' && $action === 'login') {
    jsonError('Method not allowed', 405);
}

switch ($action) {
    case 'health':
        // Non-sensitive diagnostics to confirm server file structure / active config
        jsonResponse([
            'success' => true,
            'health' => true,
            'php_version' => PHP_VERSION,
            'method' => $method,
            'config' => [
                'admin_username' => $CONFIG['admin_username'] ?? null,
                'token_expire' => $CONFIG['token_expire'] ?? null,
                'tools_file' => $CONFIG['tools_file'] ?? null,
                'tools_file_exists' => isset($CONFIG['tools_file']) ? file_exists($CONFIG['tools_file']) : false,
            ],
        ]);
        break;

    case 'login':
        $body = getJsonBody();
        $username = $body['username'] ?? '';
        $password = $body['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            jsonError('Username and password are required', 400);
        }
        
        // Verify credentials
        if ($username !== ($CONFIG['admin_username'] ?? '') || !password_verify($password, $CONFIG['admin_password'])) {
            jsonError('Invalid credentials', 401);
        }
        
        // Generate token
        $token = generateToken(['username' => $username, 'role' => 'admin']);
        
        jsonResponse([
            'success' => true,
            'token' => $token,
            'user' => [
                'username' => $username,
                'role' => 'admin'
            ]
        ]);
        break;
        
    case 'verify':
        $payload = requireAuth();
        jsonResponse([
            'success' => true,
            'valid' => true,
            'user' => [
                'username' => $payload['username'] ?? null,
                'role' => $payload['role']
            ]
        ]);
        break;
        
    case 'logout':
        // Token is stateless, client just needs to delete it
        jsonResponse(['success' => true, 'message' => 'Logged out']);
        break;
        
    default:
        jsonError('Unknown action', 400);
}

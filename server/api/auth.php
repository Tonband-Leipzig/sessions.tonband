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
    case 'login':
        $body = getJsonBody();
        $email = $body['email'] ?? '';
        $password = $body['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            jsonError('Email and password are required', 400);
        }
        
        // Verify credentials
        if ($email !== $CONFIG['admin_email'] || !password_verify($password, $CONFIG['admin_password'])) {
            jsonError('Invalid credentials', 401);
        }
        
        // Generate token
        $token = generateToken(['email' => $email, 'role' => 'admin']);
        
        jsonResponse([
            'success' => true,
            'token' => $token,
            'user' => [
                'email' => $email,
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
                'email' => $payload['email'],
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

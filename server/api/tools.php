<?php
/**
 * Tools API Endpoint - Fallback-Modus
 * Liest tools.json aus mehreren möglichen Pfaden
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;

function normalizeBool($val) {
    if (is_bool($val)) return $val;
    if (is_int($val)) return $val !== 0;
    if (is_string($val)) return strtolower($val) === 'true' || $val === '1';
    return false;
}

function loadTools() {
    $paths = array(
        dirname(__DIR__) . '/data/tools.json',  // ../data/tools.json
        __DIR__ . '/tools.json',                 // api/tools.json (same dir)
        __DIR__ . '/data/tools.json',            // api/data/tools.json
    );

    foreach ($paths as $file) {
        if (file_exists($file)) {
            $content = @file_get_contents($file);
            if ($content !== false) {
                $data = json_decode($content, true);
                if (json_last_error() === JSON_ERROR_NONE && isset($data['tools'])) {
                    foreach ($data['tools'] as &$tool) {
                        $tool['is_internal'] = normalizeBool($tool['is_internal']);
                        if (!isset($tool['thumbnail_url'])) {
                            $tool['thumbnail_url'] = null;
                        }
                        if (!isset($tool['thumbnail_full_url'])) {
                            $tool['thumbnail_full_url'] = null;
                        }
                    }
                    unset($tool);
                    return array('tools' => $data['tools'], 'source' => $file);
                }
            }
        }
    }

    return array('tools' => array(), 'source' => 'not found');
}

function saveTools($tools) {
    global $CONFIG;
    $content = json_encode(array('tools' => $tools), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return file_put_contents($CONFIG['tools_file'], $content) !== false;
}

function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function sortTools($a, $b) {
    $aInt = normalizeBool($a['is_internal'] ?? false);
    $bInt = normalizeBool($b['is_internal'] ?? false);
    if ($aInt !== $bInt) return $aInt ? 1 : -1;
    return (isset($a['display_order']) ? (int)$a['display_order'] : 0) - (isset($b['display_order']) ? (int)$b['display_order'] : 0);
}

$result = loadTools();
$tools = $result['tools'];
$sourceFile = $result['source'];

switch ($method) {
    case 'GET':
        if ($id) {
            foreach ($tools as $tool) {
                if ($tool['id'] === $id) {
                    jsonResponse(array('success' => true, 'tool' => $tool));
                }
            }
            jsonError('Tool not found', 404);
        } else {
            usort($tools, 'sortTools');
            jsonResponse(array(
                'success' => true,
                'source' => $sourceFile,
                'tool_count' => count($tools),
                'tools' => $tools
            ));
        }
        break;

    case 'POST':
        requireAuth();
        $body = getJsonBody();
        if (empty($body['title']) || empty($body['link'])) {
            jsonError('Title and link are required', 400);
        }
        $bodyInternal = normalizeBool($body['is_internal'] ?? false);
        $maxOrder = 0;
        foreach ($tools as $t) {
            if (normalizeBool($t['is_internal'] ?? false) === $bodyInternal) {
                $order = isset($t['display_order']) ? (int)$t['display_order'] : 0;
                if ($order > $maxOrder) $maxOrder = $order;
            }
        }
        $newTool = array(
            'id' => generateUUID(),
            'title' => $body['title'],
            'description' => isset($body['description']) ? $body['description'] : '',
            'link' => $body['link'],
            'icon' => isset($body['icon']) ? $body['icon'] : 'Music2',
            'thumbnail_url' => isset($body['thumbnail_url']) ? $body['thumbnail_url'] : null,
            'thumbnail_full_url' => isset($body['thumbnail_full_url']) ? $body['thumbnail_full_url'] : null,
            'is_internal' => $bodyInternal,
            'display_order' => $maxOrder + 1,
            'created_at' => date('c'),
            'updated_at' => date('c'),
        );
        $tools[] = $newTool;
        if (!saveTools($tools)) {
            jsonError('Failed to save tool', 500);
        }
        jsonResponse(array('success' => true, 'tool' => $newTool), 201);
        break;

    case 'PUT':
        requireAuth();
        if (!$id) jsonError('Tool ID is required', 400);
        $body = getJsonBody();
        $found = false;
        foreach ($tools as &$tool) {
            if ($tool['id'] === $id) {
                if (isset($body['title'])) $tool['title'] = $body['title'];
                if (isset($body['description'])) $tool['description'] = $body['description'];
                if (isset($body['link'])) $tool['link'] = $body['link'];
                if (isset($body['icon'])) $tool['icon'] = $body['icon'];
                if (array_key_exists('thumbnail_url', $body)) $tool['thumbnail_url'] = $body['thumbnail_url'];
                if (array_key_exists('thumbnail_full_url', $body)) $tool['thumbnail_full_url'] = $body['thumbnail_full_url'];
                if (isset($body['is_internal'])) $tool['is_internal'] = normalizeBool($body['is_internal']);
                if (isset($body['display_order'])) $tool['display_order'] = (int)$body['display_order'];
                $tool['updated_at'] = date('c');
                $found = true;
                break;
            }
        }
        unset($tool);
        if (!$found) jsonError('Tool not found', 404);
        if (!saveTools($tools)) jsonError('Failed to save tool', 500);
        jsonResponse(array('success' => true, 'message' => 'Tool updated'));
        break;

    case 'DELETE':
        requireAuth();
        if (!$id) jsonError('Tool ID is required', 400);
        $originalCount = count($tools);
        $deletedTool = null;
        foreach ($tools as $tool) {
            if ($tool['id'] === $id) {
                $deletedTool = $tool;
                break;
            }
        }
        $filtered = array();
        foreach ($tools as $tool) {
            if ($tool['id'] !== $id) $filtered[] = $tool;
        }
        $tools = $filtered;
        if (count($tools) === $originalCount) jsonError('Tool not found', 404);
        $category = normalizeBool($deletedTool['is_internal'] ?? false);
        $categoryTools = array();
        foreach ($tools as $tool) {
            if (normalizeBool($tool['is_internal'] ?? false) === $category) $categoryTools[] = $tool;
        }
        usort($categoryTools, 'sortTools');
        $orderMap = array();
        foreach ($categoryTools as $index => $tool) {
            $orderMap[$tool['id']] = $index + 1;
        }
        foreach ($tools as &$tool) {
            if (normalizeBool($tool['is_internal'] ?? false) === $category && isset($orderMap[$tool['id']])) {
                $tool['display_order'] = $orderMap[$tool['id']];
            }
        }
        unset($tool);
        if (!saveTools($tools)) jsonError('Failed to save tool', 500);
        jsonResponse(array('success' => true, 'message' => 'Tool deleted'));
        break;

    default:
        jsonError('Method not allowed', 405);
}

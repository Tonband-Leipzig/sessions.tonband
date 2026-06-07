<?php
// Standalone debug - no dependencies
header('Content-Type: application/json');

$jsonFile = dirname(__DIR__) . '/data/tools.json';
$result = array(
    'php_version' => PHP_VERSION,
    'json_file' => $jsonFile,
    'json_exists' => file_exists($jsonFile),
);

if (file_exists($jsonFile)) {
    $content = file_get_contents($jsonFile);
    $data = json_decode($content, true);
    $result['json_size'] = strlen($content);
    $result['json_valid'] = json_last_error() === JSON_ERROR_NONE;
    $result['tools_count'] = isset($data['tools']) ? count($data['tools']) : 0;
    if (isset($data['tools'])) {
        $titles = array();
        foreach ($data['tools'] as $tool) {
            $titles[] = $tool['title'];
        }
        $result['tool_titles'] = $titles;
    }
}

echo json_encode($result, JSON_PRETTY_PRINT);

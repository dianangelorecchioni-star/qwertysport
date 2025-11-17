<?php
// Conexión a MySQL (Hostinger)
$DB_HOST = '193.203.175.157';
$DB_NAME = 'u157683007_qwerysport';
$DB_USER = 'u157683007_dian';
$DB_PASS = 'AngeloRecchioni1234';
$DB_CHARSET = 'utf8mb4';

function db(): PDO {
    global $DB_HOST,$DB_NAME,$DB_USER,$DB_PASS,$DB_CHARSET;
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset={$DB_CHARSET}";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
        $pdo->exec("SET time_zone = '+00:00'");
    }
    return $pdo;
}

function cors(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function respond($data, int $status = 200): void {
    http_response_code($status);
    // Forzar siempre respuesta JSON para que el frontend pueda parsearla con fetch
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
?>

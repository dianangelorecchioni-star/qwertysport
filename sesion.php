<?php
require_once __DIR__ . '/conexion.php';
session_start();

$skipCors = ($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS';
if (!$skipCors) { cors(); }

// Verificar si hay una sesión activa
if (!isset($_SESSION['uid']) || !isset($_SESSION['email'])) {
    respond(['ok' => false, 'usuario' => null], 200);
}

try {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT id, nombre, email FROM usuarios WHERE id = ? AND email = ? LIMIT 1');
    $stmt->execute([$_SESSION['uid'], $_SESSION['email']]);
    $u = $stmt->fetch();

    if (!$u) {
        // Sesión inválida, limpiar
        session_destroy();
        respond(['ok' => false, 'usuario' => null], 200);
    }

    respond(['ok' => true, 'usuario' => [
        'id' => $u['id'],
        'nombre' => $u['nombre'],
        'email' => $u['email'],
        'rol' => 'cliente'
    ]], 200);
} catch (Throwable $e) {
    respond(['ok' => false, 'error' => 'Error del servidor'], 500);
}
?>


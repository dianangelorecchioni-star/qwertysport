<?php
require_once __DIR__ . '/conexion.php';
session_start();

$skipCors = ($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS';
if (!$skipCors) { cors(); }

// Destruir la sesión PHP
session_destroy();

respond(['ok' => true, 'mensaje' => 'Sesión cerrada correctamente'], 200);
?>


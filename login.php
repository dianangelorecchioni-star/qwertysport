<?php
require_once __DIR__ . '/conexion.php';
session_start();

$skipCors = ($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS';
if (!$skipCors) { cors(); }

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email = strtolower(trim($input['email'] ?? ''));
$pass = (string)($input['pass'] ?? '');

if ($email === '' || $pass === '') {
    respond(['ok'=>false,'error'=>'Email y contraseña son obligatorios'], 400);
}

try {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT id,nombre,email,password FROM usuarios WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $u = $stmt->fetch();

    if (!$u || !password_verify($pass, $u['password'])) {
        respond(['ok'=>false,'error'=>'Credenciales inválidas'], 401);
    }

    // Sesión PHP
    $_SESSION['uid'] = $u['id'];
    $_SESSION['email'] = $u['email'];

    respond(['ok'=>true,'usuario'=>[
        'id'=>$u['id'],
        'nombre'=>$u['nombre'],
        'email'=>$u['email'],
        'rol'=>'cliente'
    ]]);
} catch (Throwable $e) {
    respond(['ok'=>false,'error'=>'Error del servidor'], 500);
}

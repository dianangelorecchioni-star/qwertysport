<?php
require_once __DIR__ . '/conexion.php';
session_start();

$skipCors = ($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS';
if (!$skipCors) { cors(); }

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$nombre = trim($input['nombre'] ?? '');
$email = strtolower(trim($input['email'] ?? ''));
// aceptar tanto 'pass' como 'password' según el name del formulario
$pass = (string)($input['pass'] ?? $input['password'] ?? '');

if ($nombre === '' || $email === '' || $pass === '') {
    respond(['ok'=>false,'error'=>'Faltan campos obligatorios'], 400);
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(['ok'=>false,'error'=>'El formato del email no es válido'], 400);
}

// Validar que el email sea solo de Gmail o Hotmail/Outlook
$dominio = explode('@', $email)[1] ?? '';
$dominiosPermitidos = ['gmail.com', 'hotmail.com', 'hotmail.es', 'outlook.com', 'outlook.es', 'live.com', 'live.es'];
if (!in_array($dominio, $dominiosPermitidos, true)) {
    respond(['ok'=>false,'error'=>'Solo se permiten cuentas de Gmail o Hotmail/Outlook. Por favor, usa un email válido de estos servicios.'], 400);
}

// Validar contraseña: 6-14 caracteres, al menos una mayúscula y un signo especial
if (strlen($pass) < 6) {
    respond(['ok'=>false,'error'=>'La contraseña debe tener al menos 6 caracteres'], 400);
}
if (strlen($pass) > 14) {
    respond(['ok'=>false,'error'=>'La contraseña no puede tener más de 14 caracteres'], 400);
}
if (!preg_match('/[A-Z]/', $pass)) {
    respond(['ok'=>false,'error'=>'La contraseña debe contener al menos una letra mayúscula'], 400);
}
if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\\\|,.<>\/?]/', $pass)) {
    respond(['ok'=>false,'error'=>'La contraseña debe contener al menos un signo especial (!@#$%^&*()_+-=[]{}|;:,.<>?)'], 400);
}

try {
    $pdo = db();
    // Verificar email único
    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        respond(['ok'=>false,'error'=>'El email ya está registrado'], 409);
    }

    $hash = password_hash($pass, PASSWORD_DEFAULT);
    // La tabla usa la columna 'password' (no 'password_hash') según el esquema
    $stmt = $pdo->prepare('INSERT INTO usuarios (nombre,email,password) VALUES (?,?,?)');
    $stmt->execute([$nombre,$email,$hash]);

    $userId = $pdo->lastInsertId();
    
    // Crear sesión PHP
    $_SESSION['uid'] = $userId;
    $_SESSION['email'] = $email;

    respond(['ok'=>true,'usuario'=>[
        'id'=>$userId,
        'nombre'=>$nombre,
        'email'=>$email,
        'rol'=>'cliente'
            ]], 201);
} catch (Throwable $e) {
    respond(['ok'=>false,'error'=>'Error del servidor'], 500);
}

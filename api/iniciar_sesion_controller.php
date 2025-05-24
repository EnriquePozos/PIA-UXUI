<?php
// api/iniciar_sesion_controller.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../conexion/conexion.php';

// Verificar que sea método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "Método no permitido. Use POST."));
    exit();
}

// Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array("message" => "Error de conexión a la base de datos: " . $conn->connect_error));
    exit();
}

// Obtener datos del cuerpo de la petición JSON
$input = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
if (!isset($input['usuario']) || !isset($input['contraseña']) || 
    empty(trim($input['usuario'])) || empty(trim($input['contraseña']))) {
    http_response_code(400);
    echo json_encode(array("message" => "Usuario y contraseña son requeridos"));
    exit();
}

$usuario = trim($input['usuario']);
$contraseña = trim($input['contraseña']);

// Buscar usuario en la base de datos
$stmt = $conn->prepare("SELECT idUsuario, usuario, contraseña FROM Usuario WHERE usuario = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(array("message" => "Error preparando la consulta: " . $conn->error));
    exit();
}

$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401); // Unauthorized
    echo json_encode(array("message" => "Usuario no encontrado"));
    $stmt->close();
    $conn->close();
    exit();
}

$user_data = $result->fetch_assoc();

// Verificar contraseña (comparación directa - en producción usar password_verify())
if ($user_data['contraseña'] !== $contraseña) {
    http_response_code(401);
    echo json_encode(array("message" => "Contraseña incorrecta"));
} else {
    http_response_code(200);
    echo json_encode(array(
        "message" => "Inicio de sesión exitoso",
        "data" => array(
            "idUsuario" => $user_data['idUsuario'],
            "usuario" => $user_data['usuario']
        )
    ));
}

$stmt->close();
$conn->close();
?>
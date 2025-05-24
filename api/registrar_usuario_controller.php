<?php
// api/registrar_usuario_controller.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../conexion/conexion.php';

// Verificar que sea método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
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
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Usuario y contraseña son requeridos"));
    exit();
}

$usuario = trim($input['usuario']);
$contraseña = trim($input['contraseña']);

// Preparar y ejecutar el procedimiento almacenado
$stmt = $conn->prepare("CALL spInsertUsuario(?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(array("message" => "Error preparando la consulta: " . $conn->error));
    exit();
}

$stmt->bind_param("ss", $usuario, $contraseña);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(array("message" => "Usuario registrado exitosamente"));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Error al registrar usuario: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
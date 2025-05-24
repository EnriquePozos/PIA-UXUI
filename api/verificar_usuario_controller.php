<?php
// api/verificar_usuario_controller.php

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
if (!isset($input['usuario']) || empty(trim($input['usuario']))) {
    http_response_code(400);
    echo json_encode(array("message" => "El usuario es requerido"));
    exit();
}

$usuario = trim($input['usuario']);

// Verificar si el usuario ya existe
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM Usuario WHERE usuario = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(array("message" => "Error preparando la consulta: " . $conn->error));
    exit();
}

$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$exists = $row['count'] > 0;

http_response_code(200);
echo json_encode(array(
    "exists" => $exists,
    "message" => $exists ? "Usuario ya existe" : "Usuario disponible"
));

$stmt->close();
$conn->close();
?>
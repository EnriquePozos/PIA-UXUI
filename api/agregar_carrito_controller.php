<?php
// api/agregar_carrito_controller.php

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
if (!isset($input['idUsuario']) || !isset($input['idProducto']) || !isset($input['cantidad']) ||
    !is_numeric($input['idUsuario']) || !is_numeric($input['idProducto']) || !is_numeric($input['cantidad'])) {
    http_response_code(400);
    echo json_encode(array("message" => "idUsuario, idProducto y cantidad son requeridos y deben ser numéricos"));
    exit();
}

$idUsuario = (int)$input['idUsuario'];
$idProducto = (int)$input['idProducto'];
$cantidad = (int)$input['cantidad'];

// Preparar y ejecutar el procedimiento almacenado
$stmt = $conn->prepare("CALL spSumarProductoAlCarrito(?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(array("message" => "Error preparando la consulta: " . $conn->error));
    exit();
}

$stmt->bind_param("iii", $idUsuario, $idProducto, $cantidad);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(array("message" => "Producto agregado al carrito exitosamente"));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Error al agregar producto al carrito: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
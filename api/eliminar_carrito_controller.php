<?php
// api/eliminar_carrito_controller.php

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
if (!isset($input['idUsuario']) || !isset($input['idProducto']) ||
    !is_numeric($input['idUsuario']) || !is_numeric($input['idProducto'])) {
    http_response_code(400);
    echo json_encode(array("message" => "idUsuario e idProducto son requeridos y deben ser numéricos"));
    exit();
}

$idUsuario = (int)$input['idUsuario'];
$idProducto = (int)$input['idProducto'];

// Preparar y ejecutar el procedimiento almacenado
$stmt = $conn->prepare("CALL spEliminarProductoDelCarrito(?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(array("message" => "Error preparando la consulta: " . $conn->error));
    exit();
}

$stmt->bind_param("ii", $idUsuario, $idProducto);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(array("message" => "Producto eliminado del carrito exitosamente"));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Error al eliminar producto del carrito: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
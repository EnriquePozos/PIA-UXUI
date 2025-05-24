<?php
// api/carrito_controller.php

header("Access-Control-Allow-Origin: *"); // En producción, restringe esto a tu dominio frontend
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET"); // Permitir GET para obtener el carrito
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// --- Configuración de la Base de Datos ---
$db_host = "localhost";
$db_user = "root"; // REEMPLAZA
$db_pass = "admin"; // REEMPLAZA
$db_name = "uxui"; // REEMPLAZA

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Error de conexión DB: " . $conn->connect_error));
    exit();
}
$conn->set_charset("utf8");

// --- Obtener datos de la solicitud ---
// Para GET (obtener carrito)
$idUsuario = isset($_GET['idUsuario']) ? intval($_GET['idUsuario']) : null;
$action = isset($_GET['action']) ? $_GET['action'] : null;

// Para POST (modificar carrito)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = isset($data->action) ? $data->action : $action; // Puede venir en GET o POST
    $idUsuario = isset($data->idUsuario) ? intval($data->idUsuario) : $idUsuario;
    $idProducto = isset($data->idProducto) ? intval($data->idProducto) : null;
    $cantidad = isset($data->cantidad) ? intval($data->cantidad) : 1; // Default a 1 para agregar
}


if (!$idUsuario) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "ID de usuario no proporcionado."));
    exit();
}

$response = array("success" => false, "message" => "Acción no válida.");

// --- Lógica de Acciones del Carrito ---
switch ($action) {
    case 'get_cart':
        // Necesitamos un procedimiento para obtener el contenido del carrito con detalles del producto
        // Ejemplo: CALL spGetContenidoCarrito(p_idUsuario);
        // Este procedimiento debería hacer un JOIN entre Carrito_Producto y Producto
        // para obtener nombreProducto, multimedia, precio, y cantidad.

        // Procedimiento almacenado spGetContenidoCarrito (DEBES CREARLO EN TU BD)
        /*
        DELIMITER //
        CREATE PROCEDURE spGetContenidoCarrito(IN p_idUsuario INT)
        BEGIN
            DECLARE p_idCarrito INT;
            SELECT idCarrito INTO p_idCarrito FROM Carrito WHERE idUsuario = p_idUsuario;

            IF p_idCarrito IS NOT NULL THEN
                SELECT
                    cp.idProducto,
                    p.nombreProducto,
                    p.multimedia,
                    p.precio, -- Asegúrate que la tabla Producto tenga 'precio'
                    cp.cantidad
                FROM Carrito_Producto cp
                JOIN Producto p ON cp.idProducto = p.idProducto
                WHERE cp.idCarrito = p_idCarrito;
            ELSE
                SELECT NULL LIMIT 0; -- Devolver un conjunto vacío si no hay carrito
            END IF;
        END //
        DELIMITER ;
        */
        $stmt = $conn->prepare("CALL spGetContenidoCarrito(?)");
        if ($stmt) {
            $stmt->bind_param("i", $idUsuario);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $carrito_items = array();
                while ($row = $result->fetch_assoc()) {
                    $carrito_items[] = $row;
                }
                $response = array("success" => true, "cart" => $carrito_items);
                http_response_code(200);
            } else {
                $response["message"] = "Error al obtener carrito: " . $stmt->error;
                http_response_code(500);
            }
            $stmt->close();
        } else {
            $response["message"] = "Error al preparar la obtención del carrito: " . $conn->error;
            http_response_code(500);
        }
        break;

    case 'add_to_cart': // Usa spSumarProductoAlCarrito
    case 'increase_quantity': // También usa spSumarProductoAlCarrito (con cantidad 1)
        if (!$idProducto) {
            $response["message"] = "ID de producto no proporcionado.";
            http_response_code(400);
            break;
        }
        $stmt = $conn->prepare("CALL spSumarProductoAlCarrito(?, ?, ?)");
        if ($stmt) {
            $qty_to_add = ($action === 'add_to_cart' && $cantidad <= 0) ? 1 : $cantidad; // Asegurar al menos 1 al agregar
            $stmt->bind_param("iii", $idUsuario, $idProducto, $qty_to_add);
            if ($stmt->execute()) {
                $response = array("success" => true, "message" => "Producto sumado/agregado al carrito.");
                http_response_code(200);
            } else {
                $response["message"] = "Error al sumar/agregar producto: " . $stmt->error;
                http_response_code(500);
            }
            $stmt->close();
        } else {
            $response["message"] = "Error al preparar la suma/agregación: " . $conn->error;
            http_response_code(500);
        }
        break;

    case 'decrease_quantity':
        if (!$idProducto) {
            $response["message"] = "ID de producto no proporcionado.";
            http_response_code(400);
            break;
        }
        // Primero, verificar la cantidad actual. Si es 1, llamar a eliminar en lugar de restar.
        // O modificar spRestarProductoDelCarrito para que elimine si cantidad llega a 0.
        // Por ahora, usaremos spRestarProductoDelCarrito como está y el frontend decidirá si eliminar.
        $stmt = $conn->prepare("CALL spRestarProductoDelCarrito(?, ?)");
        if ($stmt) {
            $stmt->bind_param("ii", $idUsuario, $idProducto);
            if ($stmt->execute()) {
                $response = array("success" => true, "message" => "Cantidad restada del producto.");
                http_response_code(200);
            } else {
                $response["message"] = "Error al restar cantidad: " . $stmt->error;
                http_response_code(500);
            }
            $stmt->close();
        } else {
            $response["message"] = "Error al preparar la resta de cantidad: " . $conn->error;
            http_response_code(500);
        }
        break;

    case 'remove_from_cart':
        if (!$idProducto) {
            $response["message"] = "ID de producto no proporcionado.";
            http_response_code(400);
            break;
        }
        $stmt = $conn->prepare("CALL spEliminarProductoDelCarrito(?, ?)");
        if ($stmt) {
            $stmt->bind_param("ii", $idUsuario, $idProducto);
            if ($stmt->execute()) {
                $response = array("success" => true, "message" => "Producto eliminado del carrito.");
                http_response_code(200);
            } else {
                $response["message"] = "Error al eliminar producto: " . $stmt->error;
                http_response_code(500);
            }
            $stmt->close();
        } else {
            $response["message"] = "Error al preparar la eliminación: " . $conn->error;
            http_response_code(500);
        }
        break;

    case 'clear_cart':
        $stmt = $conn->prepare("CALL spVaciarCarrito(?)");
        if ($stmt) {
            $stmt->bind_param("i", $idUsuario);
            if ($stmt->execute()) {
                $response = array("success" => true, "message" => "Carrito vaciado exitosamente.");
                http_response_code(200);
            } else {
                $response["message"] = "Error al vaciar carrito: " . $stmt->error;
                http_response_code(500);
            }
            $stmt->close();
        } else {
            $response["message"] = "Error al preparar el vaciado del carrito: " . $conn->error;
            http_response_code(500);
        }
        break;

    default:
        http_response_code(400); // Bad Request
        $response["message"] = "Acción no reconocida: " . $action;
        break;
}

// Limpiar resultados múltiples si los hubiera (importante después de CALL)
while ($conn->more_results() && $conn->next_result()) {
    if ($res = $conn->store_result()) {
        $res->free();
    }
}

$conn->close();
echo json_encode($response);
?>

<?php
// api/productos_controller.php

// Permitir solicitudes de cualquier origen (CORS) - ¡IMPORTANTE para desarrollo local!
// En producción, deberías restringirlo a tu dominio frontend.
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../conexion/conexion.php'; // Asegúrate de que la ruta sea correcta

// Verificar conexión
if ($conn->connect_error) {
    // Enviar error como JSON y terminar
    http_response_code(500); // Internal Server Error
    echo json_encode(
        array("message" => "Error de conexión a la base de datos: " . $conn->connect_error)
    );
    exit(); // Terminar el script
}

// Establecer el charset para la conexión (recomendado)
if (!$conn->set_charset("utf8")) {
    // Loguear el error, pero no necesariamente terminar si la consulta aún puede funcionar
    // error_log("Error cargando el conjunto de caracteres utf8: %s\n", $conn->error);
}

// --- Lógica para obtener productos ---
$productos = array();
$error_message = null;

// Llamar al procedimiento almacenado
// Es más seguro usar sentencias preparadas, pero para un CALL simple sin parámetros, esto es común.
$sql = "CALL spGetProductos()";

if ($result = $conn->query($sql)) {
    if ($result->num_rows > 0) {
        // Obtener los datos de cada fila
        while ($row = $result->fetch_assoc()) {
            // Asumimos que la tabla Producto tiene al menos estas columnas:
            // idProducto, nombreProducto, multimedia
            // Y opcionalmente 'descripcion' o la generamos
            $producto_item = array(
                "idProducto" => $row['idProducto'],
                "nombreProducto" => $row['nombreProducto'],
                "multimedia" => $row['multimedia'],
                // Si tu tabla 'Producto' tiene una columna 'descripcion', úsala:
                "descripcion" => isset($row['descripcion']) ? $row['descripcion'] : "Descubre más sobre " . $row['nombreProducto']
                // Si no, puedes omitir la descripción o poner un valor por defecto como arriba
            );
            array_push($productos, $producto_item);
        }
    }
    $result->free(); // Liberar el conjunto de resultados
} else {
    // Error al ejecutar la consulta/procedimiento
    $error_message = "Error al ejecutar el procedimiento almacenado: " . $conn->error;
}

// Es importante limpiar cualquier resultado múltiple si el procedimiento devuelve más de uno
// o si hay advertencias que podrían interferir con la salida JSON.
while ($conn->more_results() && $conn->next_result()) {
    if ($res = $conn->store_result()) {
        $res->free();
    }
}

// Cerrar conexión
$conn->close();

// --- Enviar respuesta JSON ---
if ($error_message) {
    http_response_code(500); // Internal Server Error
    echo json_encode(
        array("message" => $error_message)
    );
} else {
    if (!empty($productos)) {
        http_response_code(200); // OK
        echo json_encode($productos);
    } else {
        http_response_code(404); // Not Found (o 200 con array vacío, según preferencia)
        echo json_encode(
            array("message" => "No se encontraron productos.")
        );
    }
}
?>

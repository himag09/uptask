<?php 

$accion = filter_var($_POST['accion'], FILTER_SANITIZE_STRING);

if ($accion === 'crear') {
    $tarea = filter_var($_POST['tarea'], FILTER_SANITIZE_STRING);
    $id_proyecto = filter_var($_POST['id_proyecto'], FILTER_SANITIZE_NUMBER_INT);
    // importar conexion
    include '../funciones/conexion.php';
    try {
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto ) VALUES (?, ?) ");
        $stmt->bind_param('ss', $tarea, $id_proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}
if ($accion === 'actualizar') {
    // importar conexion
    $id_tarea = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);
    $estado = filter_var($_POST['estado'], FILTER_SANITIZE_NUMBER_INT);

    include '../funciones/conexion.php';
    try {
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ? ");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

if ($accion === 'eliminar') {
    // importar conexion
    $id_tarea = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

    include '../funciones/conexion.php';
    try {
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ? ");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}
?>
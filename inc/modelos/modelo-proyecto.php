<?php 

$accion = filter_var($_POST['accion'], FILTER_SANITIZE_STRING);

if ($accion === 'crear') {
    $proyecto = filter_var($_POST['proyecto'], FILTER_SANITIZE_STRING);
    // importar conexion
    include '../funciones/conexion.php';
    try {
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
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
    $id_proyecto = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

    include '../funciones/conexion.php';
    try {
        $stmt = $conn->prepare("DELETE FROM proyectos WHERE id = ? ");
        $stmt->bind_param('i', $id_proyecto);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_borrado' => $id_proyecto
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
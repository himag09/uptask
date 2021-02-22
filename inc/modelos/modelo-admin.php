<?php 

    $accion =filter_var($_POST['accion'], FILTER_SANITIZE_STRING);
    $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
    $usuario = filter_var($_POST['usuario'], FILTER_SANITIZE_STRING);
    
    if ($accion === 'crear') {
        // crear admins
    
        // hashear password
        $opciones = array(
            'cost' => 12
        );
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
        // importar conexion
        include '../funciones/conexion.php';
        try {
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES(?, ?) ");
            $stmt->bind_param('ss', $usuario, $hash_password);
            $stmt->execute();
            // errores en sql:
            // $respuesta = array(
            //     'respuesta' => $stmt->error_list,
            //     'error' => $stmt->error
            // );
            if ($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //throw $th;
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }
    if ($accion ==='login') {
        // log a admins
        include '../funciones/conexion.php';
        // seleccionar el user
        try {
            $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
            $stmt->bind_param('s', $usuario);
            $stmt->execute();

            // loggear user
            $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
            $stmt->fetch();
            if ($nombre_usuario) {
                // usuario existe, vertifar pass
                if (password_verify($password, $pass_usuario)) {
                    // iniciar la sesion
                    session_start();
                    $_SESSION['nombre'] = $nombre_usuario;
                    $_SESSION['id'] = $id_usuario;
                    $_SESSION['login'] = true;
                    // login correcto
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'nombre' => $nombre_usuario,
                        'tipo' => $accion
                    );
                } else {
                    $respuesta = array(
                        'resultado' => 'Password incorrecto'
                    );
                }

                
            } else {
                $respuesta = array(
                    'error' => 'usuario no existe'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //throw $th;
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);

    }


?>
eventListener();

function eventListener() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);

}
function validarRegistro(e){
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

        if (usuario === '' || password === '') {
            // validacion fallida
            Swal.fire({
                type: 'error',
                title: 'Error',
                text: 'Ambos campos son obligatorios',
              })
        } else {
            // Swal.fire({
            //     type: 'success',
            //     title: 'Correcto',
            //     text: 'Loggeando',
            //   }) 
            // Llamada a ajax

            var datos = new FormData();
            datos.append('usuario', usuario);
            datos.append('password', password);
            datos.append('accion', tipo);
            // console.log(datos.get('usuario'));
            // crear llamado
            var xhr = new XMLHttpRequest();
            // abrir con 
            xhr.open('POST', 'inc/modelos/modelo-admin.php', true);
            // retorno de datos
            xhr.onload = function(){
                if (this.status==200) {
                    var respuesta = JSON.parse(xhr.responseText);
                    // console.log(respuesta);
                    // si respuesta correcta
                    if (respuesta.respuesta === 'correcto') {
                        // si es nuevo
                        if (respuesta.tipo === 'crear') {
                            swal({
                                title: 'Usuario Creado',
                                text: 'Usuario creado correctamente',
                                type: 'success'
                            })
                        } else if (respuesta.tipo === 'login') {
                            swal({
                                title: 'Correcto',
                                text: 'Iniciando Sesion',
                                showConfirmButton: false,
                                timer: 1500,
                                type: 'success'
                            }).then((resultado) => {
                                if (resultado) {
                                    window.location.href = "index.php";
                                }
                            })
                        }
                    } else {
                        // error
                            swal({
                                title: 'Error',
                                text: 'Ocurrió un error :(',
                                type: 'error'
                            })
                        }
                }
            }
            xhr.send(datos);
        }
}
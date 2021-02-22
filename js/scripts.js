eventListener();
// lista proyectos
var listaProyectos = document.querySelector('ul#proyectos');
function eventListener() {
    // document ready 
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    });
    // boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    // boton para agregar nueva tarea
    if (document.querySelector('form.agregar-tarea')) {
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    }
    // botones para acciones de tareas 
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
    //acciones de prooyecto
    document.querySelector('.lista-proyectos').addEventListener('click', accionesProyecto);


}
function nuevoProyecto(e) {
    e.preventDefault();
    if (document.querySelector("input#nuevo-proyecto")) {
        document.querySelector("input#nuevo-proyecto").focus();  
    document.querySelector(".contenedor-proyectos").scrollTo(0, 5000);

        return false
    }
    // crear input para nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    // listaProyectos.insertBefore(nuevoProyecto, listaProyectos.childNodes[0]);
    listaProyectos.appendChild(nuevoProyecto);
    // focus al nuevo elemento
    document.querySelector("input#nuevo-proyecto").focus();  
    // desplazar hasta el final
    document.querySelector(".contenedor-proyectos").scrollTo(0, 5000);
    // seleccionar id con el np
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // al presionar enter crear proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e){
        var tecla = e.whitch || e.keyCode;
        if (tecla === 13) {
            // console.log('presionaste enter');
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    // console.log(nombreProyecto);
    // enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion','crear');

    // llamado a ajax
    var xhr = new XMLHttpRequest();
    // ABRIR LA CONN
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true); 
    // en la carga
    xhr.onload = function() {
        if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText),
            proyecto = respuesta.nombre_proyecto,
            id_proyecto = respuesta.id_insertado,
            tipo = respuesta.tipo,
            resultado = respuesta.respuesta;

            // comprobar insersion
            if (resultado === 'correcto') {
                // fue exitoso
                if (tipo === 'crear') {
                    // se creo nuevo proyecto
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                    <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                        ${proyecto}
                    </a>
                    `;
                    // agregar al html
                    listaProyectos.appendChild(nuevoProyecto);
                    // enviar alerta
                    swal({
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + proyecto + ' se creó correctamenté',
                        showConfirmButton: false,
                        timer: 1500,
                        type: 'success'
                    }).then(()=>{
                        window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                    });
                } else {
                    // se actualizó o eliminó
                }
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: 'Hubo un error!',
                  })
            }
        }
    }
    // enviar request
    xhr.send(datos);

}
// agregar nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    if (nombreTarea === '') {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: 'Una tarea no puede ir vacia',
          });
    } else {
        // insertar en phphphphphphpphphphphphphp´hphphpphphphphph
        // llamado a ajax
        var xhr = new XMLHttpRequest();
        // crear formdata 
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value );

        // abrir con
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
        // 
        xhr.onload = function() {
            if (this.status ===200) {
                var respuesta = JSON.parse(xhr.responseText);
                // asignar valores
                var resultado = respuesta.respuesta,
                tarea = respuesta.tarea,
                id_isertado = respuesta.id_insertado,
                tipo = respuesta.tipo;

                if (resultado === 'correcto') {
                    // se agregó correctamente
                    if (tipo==='crear') {
                        swal({
                            title: 'Tarea creada',
                            text: 'La tarea: ' + tarea + ' se creó correctamenté',
                            showConfirmButton: false,
                            timer: 1500,
                            type: 'success'
                        });
                        // seleccionar el parrafo con la lista vacia
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia'); 
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }
                        // construir el template
                      var nuevaTarea = document.createElement('li');
                      
                      //agregar id 
                      nuevaTarea.id= 'tarea:'+id_isertado;

                    //   agregar clase tareas
                    nuevaTarea.classList.add('tarea');
                    // construir en el html
                    nuevaTarea.innerHTML = `
                        <p>${tarea}</p>
                        <div class="acciones">
                            <i class="far fa-check-circle"></i>
                            <i class="fas fa-trash"></i>  
                        </div>
                        `;
                        // agregar al html
                    var listado = document.querySelector('.listado-pendientes ul');
                    listado.appendChild(nuevaTarea);

                    // limpiar el form
                    document.querySelector('.agregar-tarea').reset();
                    // actualizar progreso
                    actualizarProgreso();
                    } 
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error',
                      });
                }
            }
        }
        // ENVIAR consulta
        xhr.send(datos)
    }
}
// Estado de tareas
function accionesTareas(e){
    e.preventDefault();
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);

        }
    } 
    if (e.target.classList.contains('fa-trash')) {
        
        swal({
            title: 'Estás seguro?',
            text: "Esta acción es irreversible",
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!'
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                // borrar de la bd
                eliminarTareaBD(tareaEliminar);
                // BORRAR DEL HTML
                tareaEliminar.remove();

            }
            if (result.value) {
             swal(
                'Eliminado!',
                'La tarea fue borrada con exito.',
                'success'
              )
            }
          })
    }
}
// acciones proyecto
function accionesProyecto(e){
    // e.preventDefault();
    // console.log(e.target);
    if (e.target.classList.contains('fa-trash')) {
        swal({
            title: 'Estás seguro?',
            text: "Esta acción es irreversible",
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!'
        }).then((result) => {
            if (result.value) {
                var proyectoEliminar = e.target.parentElement.parentElement;
                // console.log(proyectoEliminar);
                // borrar de la bd
                eliminarProyectoBD(proyectoEliminar);
                // BORRAR DEL HTML
                proyectoEliminar.remove();
            }
            if (result.value) {
             swal(
                'Eliminado!',
                'El proyecto fue borrado con exito.',
                'success'
              )
            }
          })
    }

}
function cambiarEstadoTarea(tarea, estado) {
    // split es para separar cosas 
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    // console.log(idTarea[1]);
    // crear llamado a ajax
    var xhr = new XMLHttpRequest();
    var datos = new FormData();
    datos.append('id',idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    xhr.onload = function() {
        if (this.status===200) {
            var respuesta = JSON.parse(xhr.responseText);
            actualizarProgreso();
        } if (respuesta.respuesta != 'correcto') {
            Swal.fire({
                type: 'error',
                title: 'Error',
                text: 'Hubo un error!',
              })
        }
    }
    xhr.send(datos)
}
// Eliminar tareas de la bd
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');
    // console.log(idTarea[1]);
    // crear llamado a ajax
    var xhr = new XMLHttpRequest();
    var datos = new FormData();
    datos.append('id',idTarea[1]);
    datos.append('accion', 'eliminar');
   
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    xhr.onload = function() {
        if (this.status===200) {
            var respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);

            // comprobar que hayan tareas restantes 
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length === 0 ) {
                var texto = "<p class='lista-vacia'>No hay tareas en este proyecto.</p>"
                document.querySelector('.listado-pendientes ul').innerHTML = texto; 
            }
            // actualizar progreso
            actualizarProgreso();
        }
    }
    xhr.send(datos)
}
// eliminar proyectos de la bd
function eliminarProyectoBD(proyecto) {
    var idProyecto = proyecto.id.split(':');
    // console.log(idProyecto);
    // crear llamado a ajax
    var xhr = new XMLHttpRequest();
    var datos = new FormData();
    datos.append('id',idProyecto[1]);
    datos.append('accion', 'eliminar');
   
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    xhr.onload = function() {
        if (this.status===200) {
            var respuesta = JSON.parse(xhr.responseText);
            // console.log(respuesta);
            // redireccionar a la pagina principal si se encuentra en el proyecto borrado
            var linkBorrado = 'index.php?id_proyecto=' + respuesta.id_borrado;
            if (location.href.includes(linkBorrado)) {
                window.location = 'index.php';
            }
        }
    }
    xhr.send(datos)
}
// acutualiza avanze del proyecto
function actualizarProgreso() {
    //OBTENER TODAS LAS TAREAS
    const tareas = document.querySelectorAll('li.tarea');
    // obtener tareas completas
    const tareasCompletadas = document.querySelectorAll('i.completo');
    //DETERMINAR EL AVANCE 
    var avance = Math.round((tareasCompletadas.length / tareas.length) * 100);  
    if (isNaN(avance)) {
        avance = 0;
    }
    if (avance === 100) {
        swal({
            type: 'success',
            title: 'Proyecto Terminado',
            text: 'Ya no tienes tareas pendientes!',
          })
    }
    // ASIGNAR EL AVANCE A LA BARRA 
    if (document.querySelector('#porcentaje')) {
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';
        // AGREGAR PORCENTAJE 
        // listaProyectos.insertBefore(nuevoProyecto, listaProyectos.childNodes[0]);
        var borrar =document.querySelector('.porcentaje-c');
        if (borrar) {
            borrar.remove();
        }
        var porcen = document.createElement('div');
        porcen.innerHTML= `<p class="porcentaje-c">${avance}%</p>`;
        document.querySelector('.por').appendChild(porcen);
        
    }

}





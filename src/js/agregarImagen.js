import {Dropzone} from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content') // recuperamos el csrf token de la etiqueta meta en el heat de agregar imagen para pasarcelo a dropzon cuando quiera subir las imagenes automaticamente

Dropzone.options.imagen = {//imagen es el id que le dimos al form de añadir imagen
    dictDefaultMessage: 'Sube tus imagenes aquí', //el dict es para cambiar lo que dicen los mensajes
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false, //para que no se suba en automatico //muyyyy importante
    addRemoveLinks: true, //para que pueda remover
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers:{  // esto se llee primero en este archivo javascript y pasa el token en automatico cuando se recarga la pagina
        'CSRF-Token': token
    },
    paramName: 'imagen', // su nombre de parametro, para conectarlo con el middleware
    init: function() { //para reescribir sobre el objeto de eventos de dropzone se ejecutan cuando inicia dropzone
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar') //el ide del boton submit de añadir-imagen.pug

        btnPublicar.addEventListener('click', function() {// se registra el evento del boton para que se procecen los archivos
            dropzone.processQueue() // para procesar las imagenes //esto funciona como un submit
        })

        dropzone.on('queuecomplete', function(){ // es un evento de dropzone que indica cuando el processQueue finaliza
            if(dropzone.getActiveFiles().length == 0){ // verificamos que los archivos en la cola sean 0
                window.location.reload() // se recarga la pagina para que al volver atras haga el get de nuevo y valide so la propiedad esta ya publicada
                window.location.href = '/mis-propiedades' //redireccionamos
            }
        })
    }
} 
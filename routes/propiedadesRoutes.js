import express from 'express'
import { body } from 'express-validator' //para validar en las rutas
import { admin,crear,guardar,agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad,enviarMensaje, verMensajes } from '../controllers/propiedadController.js'
import protegerRuta from '../middleware/protegerRuta.js'//middeleware para proteger las rutas
import upload from '../middleware/subirImagen.js' // middleware para habilitar la subida de archivos
import identificarUsuario from '../middleware/identificarUsuario.js'

const router = express.Router()


router.get('/mis-propiedades',protegerRuta, admin ) //pagina principal una vez logueado //se pone el middleware para que verifique si existe un jwt



router.get('/propiedades/crear',protegerRuta, crear )    //pagina para crear propiedades
router.post('/propiedades/crear',
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La Descripcion no puede ir vacia')
        .isLength({ max: 200 }).withMessage('La Descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una Categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de Precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de Habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de Estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona una Categoria'),
    guardar //pagina para crear propiedades
)

router.get('/propiedades/agregar-imagen/:id',
protegerRuta,
agregarImagen 
)

router.post('/propiedades/agregar-imagen/:id',
// para subir imagenes , single porque es una sola imagen, si fueran varias se pone .array
protegerRuta, // solo usuarios autenticados pueden acceder a esta url
upload.single('imagen'),// imagen porque es el nombre de parametro que tiene el archivo js de dropzone 
almacenarImagen,
)

router.get('/propiedades/editar/:id',
protegerRuta,
editar
)
router.post('/propiedades/editar/:id',
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La Descripcion no puede ir vacia')
        .isLength({ max: 200 }).withMessage('La Descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una Categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de Precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de Habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de Estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona una Categoria'),
    guardarCambios //pagina para editar
)

router.post('/propiedades/eliminar/:id',
protegerRuta,
eliminar
)

router.put('/propiedades/:id', //para modificar usando api
protegerRuta,
cambiarEstado
)


//Area Publica

router.get('/propiedad/:id', //el id de la propiedad que se quiera ver
identificarUsuario,
mostrarPropiedad
)

//Almacenar los Mensajes

router.post('/propiedad/:id',
identificarUsuario,
body('mensaje').isLength({min:10}).withMessage('El Mensaje no puede ir vacio o es muy corto'),
enviarMensaje
)

router.get('/mensajes/:id',
protegerRuta,
verMensajes
)


export default router
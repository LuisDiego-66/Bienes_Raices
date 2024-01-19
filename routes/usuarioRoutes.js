import express from 'express'
import { formularioLogin,autenticar, cerrarSesion, formularioOlvidePassword, formularioRegistro, registrar, confirmar,resetPassword,comprobarToken,nuevoPassword } from '../controllers/usuarioController.js';

const router = express.Router()


//muestra el formulario de Login
router.get('/login',formularioLogin)
router.post('/login',autenticar) //para autenticar al ususario


//Cerrar session
router.post('/cerrar-sesion',cerrarSesion)


//muestra el formulario de Registro
router.get('/registro',formularioRegistro)
router.post('/registro',registrar) // la respuesta del fromulario de registro y registra al usuario

// esta ruta .get sera la que se muestre una ves se haga click en el enlace del correo de confirmar cuenta
// endpoint para confirmar en el enlace del correo que mandamos para confirmar la creacion de cuenta
router.get('/confirmar/:token', confirmar) // todo loque este despues de los 2 puntos son variables

//muestra el formulario del olvide password
router.get('/olvide-password',formularioOlvidePassword)
router.post('/olvide-password',resetPassword) //evalua si la cuenta existe y manda un correo para reestablecer el password

// esta ruta .get sera la que se muestre una ves se haga click en el enlace del correo de olvide password
//almacena el nuevo Password
router.get('/olvide-password/:token', comprobarToken ) // esta ruta evaluara el token y mostrara una pantalla depende de si el token es correcto  
router.post('/olvide-password/:token', nuevoPassword ) // esta ruta sera la respuesta del formulario al cambiar el password


export default router
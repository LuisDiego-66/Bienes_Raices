import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js' 

//Formulario login
const formularioLogin = (req,res) => {
  res.render('auth/login',{
    pagina: 'Iniciar Sesion',
    csrfToken: req.csrfToken()
  })
}

const autenticar = async (req,res)=> { //respuesta del fomulario de iniciar sesion
  //validamos que no esten vacios
  await check('email').isEmail().withMessage('El Email es Obligatorio').run(req)
  await check('password').notEmpty().withMessage('El Password es Obligatorio').run(req)
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){//si hay errores vuelve a renderizar la misma pagina pero enviando una array con los errores encontrados 
    return res.render('auth/login',{
      pagina: 'Iniciar Sesion',
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    })
  }

  const {email,password}= req.body
  const usuario = await Usuario.findOne({where:{email}})

  //Comprobar si el Usuario Existe
  if(!usuario){//si el ususario no existe vuelve a renderizar la misma pagina pero enviando una array con el mensaje
    return res.render('auth/login',{
      pagina: 'Iniciar Sesion',
      csrfToken: req.csrfToken(),
      errores:[{msg:'El usuario no existe'}]
    })
  }

  //Comprobar si el ususario Confirmo su cuenta
  if(!usuario.confirmado){//si el ususario no esta confirmado vuelve a renderizar la misma pagina pero enviando una array con el mensaje
    return res.render('auth/login',{
      pagina: 'Iniciar Sesion',
      csrfToken: req.csrfToken(),
      errores:[{msg:'Tu Cuenta no esta Confirmada'}]
    })
  }
  
  //Comprobar el Password
  if(!usuario.verificarPassword(password)){ //compara el password con la instancia de usuario.password
    return res.render('auth/login',{
      pagina: 'Iniciar Sesion',
      csrfToken: req.csrfToken(),
      errores:[{msg:'El Password es incorrecto'}]
    })
  }

  //Autenticar al Usuario
  const token = generarJWT({ id:usuario.id, nombre:usuario.nombre})//para crear la session del usuario
  //console.log(token) //imprime el JWT
  //Almacenar en un cookie
  return res.cookie('_token',token,{//crea una cookie y almacena el JWT
    httpOnli:true,
    //secure: true, //solo si se tiene la licencia https
    //sameSite: true
  }).redirect('/mis-propiedades') //Redirecciona a la pagina principal
  
}

const cerrarSesion = (req,res) => {
  return res.clearCookie('_token').status(200).redirect('/auth/login')
}




//Formulario de registro
const formularioRegistro = (req,res) => {
  res.render('auth/registro',{
    pagina: 'Crear Cuenta',
    // se debe hacer esto en cada Formulario con submit
    csrfToken: req.csrfToken()   // se pasa el token publico para que compruebe que el req es de nustra pagina
  })
}

//REGISTRO
const registrar = async (req,res) => { // async porq usaremos await
  // VALIDACIÓN 
  await check('nombre').notEmpty().withMessage('El nombre es Obligatorio').run(req)
  await check('email').isEmail().withMessage('Eso no parece un Email').run(req)
  await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de almenos 6 Caracteres').run(req)
  //Extraer datos para equals
  const {repetir_password} = req.body                 // esto nose porque  https://stackoverflow.com/questions/50592190/how-to-use-equals-in-express-validator
  await check('password').equals(repetir_password).withMessage('Los Passwords no son Iguales').run(req)
  let resultado = validationResult(req)

  //Verificar que el resultado este vacio 
  if(!resultado.isEmpty()){//si hay errores vuelve a renderizar la misma pagina pero enviando una array con los errores encontrados 
    return res.render('auth/registro',{
      pagina: 'Crear Cuenta',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }

  //Extraer datos para la consulta a la base de datos sobre usuario duplicado
  const {nombre, email, password} = req.body   

  // verifica que el usuario no este duplicado
  const existeUsuario = await Usuario.findOne({where:{email}}) //busca en la base de datos comparando el email duplicado
  if (existeUsuario){//si existe otro usuario renderiza la misma pagina mandando el mensaje de usuario duplicado
    return res.render('auth/registro',{
      pagina: 'Crear Cuenta',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'El usuario ya esta registrado'}],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }

  //Almacenar un Usuario       //const usuario = await Usuario.create(req.body) //res.json(usuario)
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId() // Genera un Id unico para cada usuario desde helpers/tokens.js
  })

  //Envia email de Confirmacion usando la instancia real usuario al momento de registrarse
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  })

  //Mensaje de confirmación
  res.render('templates/mensaje',{
    pagina: 'Cuenta Creada Correctamente',
    mensaje: 'Hemos enviado un email de Informacion, Presiona el enlace'
  })
}

//Funcion para confirmar la cuenta a travez del correo
const confirmar = async (req,res,next) => {
  const {token} = req.params
  //console.log(token) //para ver el token que llega de la url

  //Verificar si el token es Valido
  const usuario = await Usuario.findOne({where:{token} })  //busca en la base de datos un usuario con el mismo token de la URL
  if(!usuario){
    return res.render('auth/confirmar-cuenta',{
      pagina: 'Error al Confirmar tu Cuenta',
      mensaje: 'Hubo un error al confirmar tu cuenta',
      error: true
    })
  }
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();  // para guardar los cambios en la base de datos

  //Confirmar la cuenta
  return res.render('auth/confirmar-cuenta',{
    pagina: 'Cuenta confirmada',
    mensaje: 'La cuenta se confirmó correctamente',
    error: false
  })
}

//Formulario de olvide password
const formularioOlvidePassword = (req,res) => {
  res.render('auth/olvide-password',{
    pagina: 'Recupera tu Acceso a BienesRaices',
    csrfToken: req.csrfToken()
  })
}

const resetPassword = async (req,res) => {
  // VALIDACIÓN 
  await check('email').isEmail().withMessage('Eso no parece un Email').run(req) //valida solo el email
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    //Errores
    return res.render('auth/olvide-password',{
      pagina: 'Recupera tu Acceso a BienesRaices',
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    })
  }

  //Buscar el Usuario
  const {email} = req.body   
  const usuario = await Usuario.findOne({where:{email}}) //busca en la base de datos por el email
  if(!usuario){ //si el usuario no existe
    return res.render('auth/olvide-password',{
      pagina: 'Recupera tu Acceso a BienesRaices',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'El Email No Pertenece a ningun Usuario'}]
    })
  }

  //Generar un Token y enviar email para restaurar la contraseña
  usuario.token= generarId()
  await usuario.save() // el token es reemplazado si estaba lleno y si estaba vacio es llenado con el nuevo token

  //Enviar Email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  })

  //renderizar mensaje
  res.render('templates/mensaje',{
    pagina: 'Reestablece Tu Password',
    mensaje: 'Hemos enviado un email de con las Instrucciones'
  })

}

const comprobarToken = async (req,res, next) => {
  const {token}=req.params          // recuperamos el token del enlace en el que se clickeo 
  const usuario = await Usuario.findOne({where: {token}}) //buscamos el usuario con el token
  //console.log(usuario)
  if(!usuario){
    return res.render('auth/confirmar-cuenta',{ // reutilizamos la vista de confirmar cuenta para que funcione como un mensaje
      pagina: 'Reestablece tu Password',
      mensaje:'Hubo un error al validar tu Informacion, intenta de Nuevo',
      error: true
    })
  }
  // si el ususario es valido se mostrara un formulario para modificar el password
  res.render('auth/reset-password',{// en el html eliminamos el accion del form para que envie a la misma url
    pagina:'Reestablece tu Password',
    csrfToken: req.csrfToken()  
  })
}


const nuevoPassword = async (req,res) => {//post viene del formulario de guardar nuevo password pero con un token
  //Validar el Password
  await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de almenos 6 Caracteres').run(req)
  let resultado = validationResult(req)
  
  if(!resultado.isEmpty()){
    //si hay errores vuelve a renderizar la misma pagina pero enviando una array con los errores encontrados
    return res.render('auth/reset-password',{
      pagina: 'Reestablece tu Password',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    })
  }

  //Identificar el Usuario que cambia el Password
  const {token}= req.params // como se llama la misma pagina el token enviado a la primera pagina se seguira mostrando
  const {password} = req.body // recuperamos el password nuevo
  const usuario = await Usuario.findOne({where: {token}}) // la instancia de Usuario

  //Hashear el Password
  const salt = await bcrypt.genSalt(10) 
  usuario.password = await bcrypt.hash(password,salt) //para esconder el nuevo password
  usuario.token= null //se elimina el token
  await usuario.save()

  res.render('auth/confirmar-cuenta',{// se usa la misma pagina de confirmar cuenta porque no cambia
    pagina:'Password Reestablecido',
    mensaje:'El Password se guardo correctamente',
    error: false
  })
}


export{
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
} 
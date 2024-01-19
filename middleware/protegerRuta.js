import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'


const protegerRuta = async (req,res,next) => {

    //verificar si existe un jwt
    const {_token} = req.cookies //si existe un token

    if(!_token){
        return res.redirect('/auth/login')//si no existe un token no podra acceder a la pagina y redireccionara a login
    }

    //comprobar que el JWT sea valido

    try{
        const decoded = jwt.verify(_token, process.env.JWT_SECRET) // recibe el token de las cookies y la palabra secreta de env para decodificar el token
        //si el token no es valido y no pueda decodificarlo lo elimina y va al catch
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id) //obtenemos el id del Usuario que accedio a la pagina y buscamos al usuario en la tabla de usuarios // retorna solo los valores que no se hayan marcado en el Scope del modelo
        
        //Almacenar el Usuario en el request
        if(usuario){
            req.usuario = usuario //si el usuario existe se le agrega al req la propiedad de usuario y se le pasa el usuario que esta en el JWT
        }else{
            return res.redirect('/auth/login')//si el usuario fue eliminado de la base de datos pero si jwt siga en las cookies
        }
        return next() //para que vaya al sgte middleware osea mis-propiedades

    }catch(error){
        return res.clearCookie(_token).redirect('/auth/login')//Limpia el token de las cookies y redirecciona a login
    }
}

export default protegerRuta
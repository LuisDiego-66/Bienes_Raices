import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'


const identificarUsuario = async (req,res,next) => {
    //identificar si hay un token
    const {_token} = req.cookies

    if(!_token){
        req.usuario = null
        return next()
    }

    //comprobar el token
    try{

        const decoded = jwt.verify(_token, process.env.JWT_SECRET) 
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id) //obtenemos el id del Usuario que accedio a la pagina y buscamos al usuario en la tabla de usuarios // retorna solo los valores que no se hayan marcado en el Scope del modelo
        
        if(usuario){
            req.usuario =usuario
        }

        return next() 

    }catch(error){
        console.log(error)
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default identificarUsuario
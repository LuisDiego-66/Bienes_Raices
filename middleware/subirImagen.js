import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/tokens.js' //para que los archivos no puedan tener el mismo nombre


const storage = multer.diskStorage({

    destination: function(req,file,cb){ // se se llega a llamar al cb callback significa que se subio correctamente la imagen
        cb(null, './public/uploads/') // lugar donde se guardaran las imagenes
    },
    filename: function(req,file,cb){ //el nombre de como se llamara el archivo que se va a almacenar
        cb(null, generarId() + path.extname(file.originalname)) //para que se guarde con la misma extencion
    }
})

const upload = multer({storage})

export default upload
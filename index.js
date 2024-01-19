import express from 'express'
import csrf from 'csurf'                  //para ataques CSRF
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

 
//Crear la App
const app = express()

//Habilitar Lectura de Formularios
app.use(express.urlencoded({extended: true})) //solo para imputs, textarea, selects etc

//Habilitar cookie parser
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({cookie:true})) 

//Conexion a la base de datos 
try{
   await db.authenticate();
   db.sync() 
   console.log('Coneccion Correcta a la Base de Datos' )
   }catch(error){
      console.log(error)
} 

//habilitar pug 
app.set('view engine','pug')
app.set('views','./views')

//Carpeta Pública
app.use(express.static('public'))      

//Routing
app.use('/',appRoutes);
app.use('/auth',usuarioRoutes); 
app.use('/',propiedadesRoutes); 

app.use('/api',apiRoutes); 

// Definir un puerto y arrancar el proyecto 
const port = process.env.PORT || 3000;
app.listen(port ,() => {
   console.log(`El servidor esta corriendo en el puerto ${port} `+port)
});

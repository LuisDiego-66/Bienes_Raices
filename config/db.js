import Sequelize from "sequelize";
import dotenv from 'dotenv'             //para variables de entorno
dotenv.config({path: '.env'})           //para indicar donde esta el archivo de las variables de entorno

const db =new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS ?? '',{
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql', 
    define:{
        timestamps:true  //crea un 2 columnas de tiempo extras cuando un ususario se registra 
    },
    pool:{
        max: 5,          //maximo de conecciones para reutilizar
        min: 0,          //minimo de conecciones 
        acquire: 30000,  // 30 seguntos de tiepo que va a pasar tratando de elaborar una coneccion antes de soltar un error
        idle: 10000      // 10 segundos para la que la coneccion finalice
    },
    operatorAliases:false
});

export default db
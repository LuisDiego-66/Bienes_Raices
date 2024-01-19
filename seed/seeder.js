import { exit } from "node:process"; //una forma de terminar los procesos
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
//import Categoria from '../models/Categoria.js' //ya los importo desde Index.js de models
//import Precio from '../models/Precio.js'
import db from "../config/db.js"; //instancia de la base de datos
import { Categoria, Precio, Usuario } from "../models/index.js"; //los modelos importados desde el documento de relaciones

const importarDatos = async () => {
  try {
    //Autenticar en la Base de Datos
    await db.authenticate();

    //Generar las Columnas
    await db.sync();

    //Insertar Datos
    //await Categoria.bulkCreate(categorias) //inserta todos los datos de golpe de un arreglo

    await Promise.all([
      // para no usar 2 await porq pueden correr en paralelo y porq una no depende de la otra
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
      Usuario.bulkCreate(usuarios),
    ]);

    console.log("Datos Importados Correctamente");
    exit(); //porq fue correcto
  } catch (error) {
    console.log(error);
    exit(1); //una forma de terminar los procesos
  }
};

const eliminarDatos = async () => {
  try {
    //Destruir los registros de Categoria y Precios
    await Promise.all([
      //Categoria.destroy({where:{},truncate:true}),// truncate para reiniciar el id contador
      await db.sync({ force: true }), //muy Fuerte, destruye todos los datos de la base de datos
    ]);
    console.log("Datos Eliminados Correctamente");
    exit();
  } catch (error) {
    console.log(error);
    exit(1); //una forma de terminar los procesos
  }
};

// cuando se mande llamar al script de db del package se preguntara si el 2do termino del arreglo enviado es -i y asi ejecutara el seeder
if (process.argv[2] == "-i") {
  // son los argumentos que se mandaran desde la consola
  importarDatos();
}

if (process.argv[2] == "-e") {
  eliminarDatos();
}

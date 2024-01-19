import { DataTypes } from "sequelize"
import db from "../config/db.js" //instancia de la base de datos

const Propiedad = db.define('propiedades',{
    id: {
        type: DataTypes.UUID, //crea una cadena unica como id
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true //llave primaria de la propiedad
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calle: {
        type: DataTypes.STRING(60),//la calle
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING,//la latitud
        allowNull: false
    },
    lng: {
        type: DataTypes.STRING,//la longitud
        allowNull: false
    },
    imagen:{
        type: DataTypes.STRING,// Imagen
        allowNull: false
    },
    publicado:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
}
)

export default Propiedad
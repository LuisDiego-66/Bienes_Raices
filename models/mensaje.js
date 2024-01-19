import { DataTypes } from "sequelize"
import db from "../config/db.js" //instancia de la base de datos

const Mensaje = db.define('mensajes',{
    mensaje: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
})
export default Mensaje
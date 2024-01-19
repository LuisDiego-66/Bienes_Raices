import { DataTypes } from "sequelize"
import bcrypt from 'bcrypt'//dependencia para hashear el password
import db from "../config/db.js" //instancia de la base de datos

const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
    hooks:{// los hooks son funciones que se pueden agregar a cierto modelo
        beforeCreate: async function(usuario){//la instancia de la clase usuario
            const salt = await bcrypt.genSalt(10) 
            usuario.password = await bcrypt.hash(usuario.password,salt) //para esconder el password
        }    
    },
    scopes:{// son para eliminar ciertos campos cuando se hace una consulta a un modelo en especifico
        eliminarPassword:{
            atributes: {
                exclude:['password','token','confirmado','createdAt','updatedAt']

            }
        }
    }
})

//Metodo Personalizado para comparar Passwords
Usuario.prototype.verificarPassword= function(password){    //dentro del prototype del objeto registramos nuestra funcion
    return bcrypt.compareSync(password,this.password)       //Usamos function porq debe apuntar a la instancia actual
} 

export default Usuario
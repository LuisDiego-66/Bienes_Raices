import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Usuario from './Usuario.js'
import Categoria from './Categoria.js'
import Mensaje from './mensaje.js'

//Precio.hasOne(Propiedad) //una propiedad tiene un precio
Propiedad.belongsTo(Precio,{foreignKey:'precioId'})//una propiedad tiene un precio     (Precio) para poner el nombre de la llave foranea en automatico

Propiedad.belongsTo(Categoria,{foreignKey:'categoriaId'})

Propiedad.belongsTo(Usuario,{foreignKey:'usuarioId'})

Propiedad.hasMany(Mensaje,{foreignKey:'propiedadId'})


//Usuario.hasMany(Propiedad,{foreignkey:'IdUsuario'})

//Mensaje.belongsTo(Propiedad,{foreignkey:{name: 'propiedadId'}} ) //qu pdo q paso alv ayuda aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId'});

Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId'});




//al importar los modelos de este documento se crea la tabla propiedad ya que hace automaticamente el paso de la llave foranea
export{
    Propiedad,
    Precio,
    Usuario,
    Categoria,
    Mensaje

}
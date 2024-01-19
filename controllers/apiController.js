import {Propiedad, Precio,Categoria} from '../models/index.js'

const propiedades = async (req,res) =>{

    const propiedades = await Propiedad.findAll({
        include:[
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'}
        ]
    })
    res.json( //convierte a json la consulta que hicimos
        propiedades
    )//consumiremos este archivo desde el js de mapaInicio
}


export{
    propiedades
}
import {Sequelize} from 'sequelize'
import {Propiedad, Categoria, Precio} from '../models/index.js'



const inicio = async (req,res) => {


    const [categorias, precios, casas, departamentos] = await Promise.all([

        Categoria.findAll({raw: true}), //para que nos devuelva solo los datos importantes sin sus modificaciones 
        Precio.findAll({raw: true}),

        Propiedad.findAll({ // le mandamos las 3 mas nuevas casas
            limit:3,
            where:{
                categoriaId:1
            },
            include: [
                {
                    model:Precio,
                    as: 'precio'
                }
            ],
            order:[
                ['createdAt','DESC']  //ordenado de manera descendente
            ]
        }),

        Propiedad.findAll({ // le mandamos los 3 mas nuevos departamentos
            limit:3,
            where:{
                categoriaId:2
            },
            include: [
                {
                    model:Precio,
                    as: 'precio'
                }
            ],
            order:[
                ['createdAt','DESC']
            ] 
        })

    ])

    res.render('inicio',{
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken()
    })
}


const categoria = async (req,res) => {
    const {id} = req.params

    //Comprobar que la categoria exista

    const categoria = await Categoria.findByPk(id)

    //console.log(id)
    if(!categoria){
        return res.redirect('/404')
    }

    //Obtener las propiedades de la Categoria
    const propiedades = await Propiedad.findAll({
        where:{
            categoriaId:id
        },
        include: [
            { model: Precio, as: 'precio' }
        ]
    })

    res.render('categoria',{
        pagina: `${categoria.nombre}s en Venta`,
        propiedades,
        csrfToken: req.csrfToken()
    })
}

const noEncontrado = (req,res) => {
    res.render('404',{
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}

const buscador = async (req,res) => {
    const {termino} =req.body
    if(!termino.trim()){ //para que no tenga espacios
        return res.redirect('back') // para que nos regrese a la pagina donde nos encontramos
    }
    // consultar propiedades
    const propiedades = await Propiedad.findAll({
        where:{
            titulo:{
                [Sequelize.Op.like] : '%' + termino + '%' // busca en la columna titulo
            },
        },
        include:[
            {model:Precio, as: 'precio'}
        ]
    })

    res.render('busqueda',{
        pagina: 'Resultados de la Busqueda',
        csrfToken: req.csrfToken(),
        propiedades
    })
}

export{
    inicio,
    categoria,
    noEncontrado,
    buscador
}
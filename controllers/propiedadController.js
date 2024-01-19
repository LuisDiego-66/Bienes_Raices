import { unlink } from 'node:fs/promises' //para eliminar la imagen
import { validationResult } from 'express-validator'// para obtener el arreglo de errores desde routes
import { Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js'
import {esVendedor, formatearFecha} from '../helpers/index.js'

//Vista de la pagina principal EL ADMIN
const admin = async (req,res) => {
    
    //leer el QueryString para la paginacion

    const {pagina:paginaActual} = req.query  //obtenemos la variable de la url y la renombramos como pagina Actual
    const expresion = /^[1-9]$/ //exprecion regular para que siempre comience y termine con digitos

    if(!expresion.test(paginaActual)){
        return res.redirect('mis-propiedades?pagina=1')
    }

    try{

        const {id} = req.usuario // extraemos el id del usuario (req.usuario es un atributo añadido en el middleware desde el JWT)

        //Limites y offset para el paginador
        const limit = 5
        const offset = (paginaActual*limit)-limit  //esto calcula el nuevo comienzo de la pagina primero es 0, despues en 10. despues 20
    
        const [propiedades,total] = await Promise.all([ //para mas de una consulta a la vez
            
            Propiedad.findAll({ //Busca todas las propiedades de un usuario
                limit, //el limite de la consulta
                offset, // el nuevo inicio de la consulta, se salta esa cantidad de registros
                where:{
                    usuarioId : id
                },
                include:[ // es un inner join con categoria, gracias a las relaciones que hisimos con propiedades y categorias
                    {model: Categoria, as: 'categoria'},
                    {model: Precio, as: 'precio'},
                    {model: Mensaje, as: 'mensajes'}
                ]
            }),

            Propiedad.count({ //para saber cuantas propiedades existen del esuariuo en cuestion
                where:{
                    usuarioId:id
                }
            })
        ])

        res.render('propiedades/admin',{
            pagina: 'Mis Propiedades',
            csrfToken: req.csrfToken(),
            propiedades : propiedades,
            paginas: Math.ceil(total/limit), //redondea hacia arriba la division ejemp: 2.1 a 3
            paginaActual: Number(paginaActual) , //para saber en que pagina nos encontramos
            total,
            offset,
            limit
        })

    }catch(error){
        console.log(error)
    }
}

//Formulario para crear una nueva Propiedad
const crear = async (req,res) => {
    //consultar Modelo de Precio y Categorias 
    const[categorias,precios]= await Promise.all([
        Categoria.findAll(), // hace un select a la base de datos y devuelve todos los datos de categoria
        Precio.findAll() //  hace un select a la base de datos y devuelve todos los datos de precio
    ])
    res.render('propiedades/crear',{
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(), //nose porque , si no entra al get de nuevo
        categorias, //se pasa el arreglo que tiene todos los datos, para que en la vista se itere
        precios,
        datos: {} //para que no marque error la primera vez q llama a la pagina
    })
}

const guardar =  async (req,res) => { 
    //Validacion
    let resultado= validationResult(req)
    if(!resultado.isEmpty()){
        //consultar Modelo de Precio y Categorias
        const[categorias,precios]= await Promise.all([
            Categoria.findAll(), 
            Precio.findAll()
        ])
        return res.render('propiedades/crear',{
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias, //se pasa el arreglo que tiene todos los datos, para que en la vista se itere
            precios,
            errores:resultado.array(),
            datos: req.body //datos para autocompletar los campos si se equivoca
        })
    }
    //Crear registro
    // console.log(req.body) //para ver todos los datos de los campos de crear propiedad
    
    const {titulo, descripcion, habitaciones,estacionamiento,wc,calle,lat,lng, precio: precioId,categoria: categoriaId} = req.body//cambia el nombre a las variables
    
    const {id: usuarioId}= req.usuario // pasa el usuario entero obtenido en el middleware con su id, su nombre y su correo
    try{
        const propiedadGuardada = await Propiedad.create({ //cuando se guarde este registro, retorna una compia de ese registro en esta variable
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            //precioId : precio, una forma de hacerlo
            precioId,
            categoriaId,
            usuarioId,
            imagen : ''
        })
        const {id} = propiedadGuardada // siendo una instancia de la base de datos osea la respuesta del guardado sacamos el id para enviarlo al boton de añadir imagen

        //res.redirect(`/propiedades/agregar-imagen/${id}`)
        res.redirect('/propiedades/agregar-imagen/'+id)


    }catch(error){
        console.log(error)
    }
}

const agregarImagen = async (req,res) =>{

    const {id}= req.params  //obtenemos el id de los parametros de la URL
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad no este publicada
    if(propiedad.publicado){ // se es 0 entonces no entrara a la condicion y si es 1 entonces ya estaba publicado y retornara al admin
        return res.redirect('/mis-propiedades')
    }

    //Validar que la pripiedad pertenezca a quien visita la pagina
    //console.log(req.usuario)
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){ //convertirlos a strings porque en otros orms no los reconoce aveces
        return res.redirect('/mis-propiedades')
    }
    res.render('propiedades/agregar-imagen',{
        pagina: 'Agregar Imagen',
        csrfToken: req.csrfToken(),
        propiedad
    })
} 

const almacenarImagen = async (req,res, next) =>{

    const {id}= req.params  
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad no este publicada
    if(propiedad.publicado){ 
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad pertenezca a quien visita la pagina
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){ 
        return res.redirect('/mis-propiedades')
    }
    //en esta parte leemos el archivo antes de subirlo
    try{
        //console.log(req.file) // solo cuando se sube una imagen  muestra todos los atributos del archivo que se subio

        //almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename //Guardamos el nombre de la imagen que se guardo en la tabla propiedades
        propiedad.publicado = 1 //publicamos la propiedad

        await propiedad.save() //lo almacena en la base de datos
        //res.redirect('/mis-propiedades') //no funciona porque el codigo se ejecuta en js desde dropzone, ahi tenemos q hacer el redirect
        next() // para que una vez terminado vaya al sgte middleware, en este caso la redireccion de dropzone
    }catch(error){
        console.log(error)
    }
}


const editar = async (req,res) => {

    //Validar
    const {id}= req.params

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){ 
        return res.redirect('/mis-propiedades')
    }

     const[categorias,precios]= await Promise.all([
        Categoria.findAll(),
        Precio.findAll() 
    ])
    res.render('propiedades/editar',{
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req,res) => {

    //Validar los campos
    let resultado= validationResult(req)

    if(!resultado.isEmpty()){
        //consultar Modelo de Precio y Categorias
        const[categorias,precios]= await Promise.all([
            Categoria.findAll(), 
            Precio.findAll()
        ])
        res.render('propiedades/editar',{
            pagina: "Editar Propiedad",
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    //Validar la Propiedad
    const {id}= req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){ 
        return res.redirect('/mis-propiedades')
    }

    // Reescribir y Actualizar
    try{

        const {titulo, descripcion, habitaciones,estacionamiento,wc,calle,lat,lng, precio: precioId,categoria: categoriaId} = req.body

        propiedad.set({ //para actualizar la propiedad
            titulo, 
            descripcion, 
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

        await propiedad.save()
        res.redirect('/mis-propiedades')

    }catch(error){
        console.log(error)
    }
}

const eliminar = async (req,res) =>{

    const {id}= req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){ 
        return res.redirect('/mis-propiedades')
    }
    //Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)

    //Eliminar Propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')
}

//modifica el estado de la propiedad
 const cambiarEstado = async (req,res) => { //cambia el estado de la propiedad

    const {id}= req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){ 
        return res.redirect('/mis-propiedades')
    }

    //Actualizar
    propiedad.publicado = !propiedad.publicado
    await propiedad.save()

    res.json({
        resultado:true
    })
 }


//Muestra una propiedad

const mostrarPropiedad = async (req,res) => {
    const {id} = req.params //recuperamos el id de la ruta 

    //Validamos que la propiedad Exista

    const propiedad = await Propiedad.findByPk(id,{
        include:[ 
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    })

    if(!propiedad || !propiedad.publicado){ // si no esta publicada no se podra ver la card de la propiedad
        return res.redirect('/404') 
    }


    res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario, //sale del middleware de identificar Usuario
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    })
}

const enviarMensaje = async (req,res) =>{
    const {id} = req.params //recuperamos el id de la ruta 

    //Validamos que la propiedad Exista

    const propiedad = await Propiedad.findByPk(id,{
        include:[ 
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    })

     if(!propiedad){
        return res.redirect('/404') 
    }

    //Renderiza Errores
    let resultado= validationResult(req)
    if(!resultado.isEmpty()){

        return  res.render('propiedades/mostrar',{
                    propiedad,
                    pagina: propiedad.titulo,
                    csrfToken: req.csrfToken(),
                    usuario: req.usuario, //sale del middleware de identificar Usuario
                    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
                    errores: resultado.array()
                })
    }

    const {mensaje}= req.body
    const {id:propiedadId} = req.params
    const {id:usuarioId} = req.usuario

    //Almacenar Mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })

    res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario, //sale del middleware de identificar Usuario
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
        enviado: true //para indicar que el mensaje ya fue enviado
    })
}

// Leer mensajes recividos
 const verMensajes = async (req,res) => {

    const {id}= req.params
    const propiedad = await Propiedad.findByPk(id,{
        include:[
        {model: Mensaje, as: 'mensajes',
            include:[
                {model: Usuario.scope('eliminarPassword'), as: 'usuario'} // doble include para que el modelo de mensajes incluya el usuario y el modelo de propiedad incluya los mensajes
            ]
        }
    ]
    })

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){ 
        return res.redirect('/mis-propiedades')
    }


    res.render('propiedades/mensajes',{
        pagina:'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha // una funcion que pasamos como una variable
    })

 }



export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}
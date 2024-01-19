(function(){

    //Mapa principal
    const lat = -19.0379428; 
    const lng = -65.2572107;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15); 

    let markers = new L.FeatureGroup().addTo(mapa) //una capa que estara encima del mapa con todos los pines
    let propiedades = []

    //Filtros

    const categoriasSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios')

    const filtros = {
        categoria:'',
        precio:''
    }


    //Filtrado de Categorias y Precios

    categoriasSelect.addEventListener('change', e =>{ // change es el evento de cambiar
        filtros.categoria = +e.target.value // el mas es para convertir el resultado a numero
        filtrarPropiedades()
    })

    preciosSelect.addEventListener('change', e =>{
        filtros.precio = +e.target.value
        filtrarPropiedades()
    })


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


    const obtenerPropiedades = async () => {
        try{
            const url = '/api/propiedades' //no hay  q ponerle el localhost porq estamos en el mismo entorno
            const respuesta = await fetch(url) //funcion para consumir una api
            propiedades = await respuesta.json() //convertimos la respuesta como json
            mostrarPropiedades(propiedades)

        }catch(error){
            console.log(error)
        }
    }

    const mostrarPropiedades = (propiedades) => {
        //Limpiar los markers previos
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            
            const marker = new L.marker([propiedad?.lat , propiedad?.lng], { //se crea un nuevo pin 
                autoPan: true
            })
            .addTo(mapa) // se agrega el pin al mapa
            .bindPopup(`
            <p class=" text-indigo-600 font-bold">${propiedad?.categoria.nombre}

            <h1 class=" text-xl font-extrabold uupercase my-2"> ${propiedad?.titulo} </h1>
            <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la Propiedad ${propiedad?.titulo} ">
            <p class=" text-gray-600 font-bold">${propiedad?.precio.nombre}

            <a href="/propiedad/${propiedad?.id} " class="bg-indigo-600 block p-2 text-center font-bold uppercase"> Ver Propiedad </a>
            `) 
            markers.addLayer(marker)// se agrega el pin al layer que se usara despues 
        })            
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio) //doble filtro metodo chaining
        //console.log(resultado)
        mostrarPropiedades(resultado)
    }

    const filtrarCategoria = propiedad => // Itera propiedad en propiedades 
        filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    const filtrarPrecio = propiedad => 
        filtros.precio ? propiedad.precioId === filtros.precio : propiedad

    obtenerPropiedades()

})()
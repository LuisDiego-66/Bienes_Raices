(function()
{
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content') //obtenemos el csrfToken del meta que mandamos a la Pagina

    cambiarEstadoBotones.forEach(boton =>{
        boton.addEventListener('click', cambiarEstadoPropiedad)
    })



    async function cambiarEstadoPropiedad(e){

        const {propiedadId: id} = e.target.dataset
        try {
            const url = `/propiedades/${id}`

            const respuesta = await fetch(url,{
            method:'PUT', // cambiamos el metodo de fetch porque por defecto es get
            headers:{
                'CSRF-Token': token //enviamos el Token en la peticion put
            }
        })
        const {resultado}= await respuesta.json() //si sale bien sera true

        if (resultado){
            if(e.target.classList.contains('bg-yellow-100')){ // preguntamos si la clase tiene amarillo
                e.target.classList.add('bg-green-100', 'text-green-800')
                e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                e.target.textContent= 'Publicado'
            }else{// si no es
                e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                e.target.classList.remove('bg-green-100', 'text-green-800')
                e.target.textContent= 'No Publicado'
            }

        }

        } catch (error) {
            console.log(error)
        }


    }
})()
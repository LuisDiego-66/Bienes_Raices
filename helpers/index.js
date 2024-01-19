const esVendedor = (usuarioId,propiedadUsuarioId) =>{
    return usuarioId == propiedadUsuarioId
}

const formatearFecha= fecha =>{

    //const nuevaFecha = new Date(fecha).toISOString().split('T')[0]// es un string para poder dividir la fecha 

    const nuevaFecha = new Date(fecha).toISOString().slice(0,10)
    const opciones ={ // opciones para cambiar el formato de la fecha
        weekday: 'long',
        year:'numeric',
        month: 'long',
        day: 'numeric'
    }
    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones) //convertimos el string en fecha nuevamente y le indicamos las opciones para el formato que queremos
}

export{
    esVendedor,
    formatearFecha
}
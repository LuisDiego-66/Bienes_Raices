import path from 'path'

export default{
    mode:'development', //modo de desarrollo
    entry:{             // archivo original
        mapa: './src/js/mapa.js',
        agregarImagen:'./src/js/agregarImagen.js',
        mostrarMapa:'./src/js/mostrarMapa.js',
        mapaInicio:'./src/js/mapaInicio.js',
        cambiarEstado:'./src/js/cambiarEstado.js'
    },
    output:{            // donde se almacena una vez compilado 
        filename: '[name].js',
        path: path.resolve('public/js')// archivos estaticos en public //la ruta es absoluta gracias a path
    }

}
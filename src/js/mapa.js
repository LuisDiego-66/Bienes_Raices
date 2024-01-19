(function() { //codigo para mostrar en el mapa las coordenadas   iffi una funcion que se invoca a si misma

//logical or 
    const lat = document.querySelector('#lat').value || -19.0379428;  //recuperamos la latitud si existe y la ponemos como nueva latitud, caso contrario se coloca el valor por defecto
    const lng = document.querySelector('#lng').value || -65.2572107; //son tipos de datos que son strings pero una combinacion con true 
    const mapa = L.map('mapa').setView([lat, lng ], 13); //la instancia del mapa

    let marker; //variable para poner un pin en el mapa

    //Utilizar provide y GeoCoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //El pin
    marker = new L.marker([lat,lng],{ //el pin es creado en el centro
        draggable:true, //para que el pin se pueda mover
        autoPan :true  // una vez se mueva el mapa lo sigue
    })
    .addTo(mapa)// se agrega el pin a la instancia del mapa


    //Detectar el movimiento del pin y leer su latitud y longitud

    marker.on('moveend', function(even){// captura el evento donde se mueve el pin

        marker= even.target
        //console.log(marker)
        const posicion = marker.getLatLng();
        console.log(posicion) //muestra las coordenada del pin en la consola

        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng)) //centra el mapa donde esta el pin

        //Obtener la informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion,13).run(function(error,resultado){ //Para mostrar la informacion de la calle y metadatos
            //console.log(resultado)
            marker.bindPopup(resultado.address.LongLabel)

            //llenar los campos escondidos de la latitud y la longitud y la calle
            document.querySelector('.calle').textContent= resultado?.address?.Address ?? ''; //llena el parrafo .calle de la vista crear.pug obteniendo la calle del pin (text.content porque es un parrafo)
            
            //llenando los campos ocultos para recuperar la latitud y la longitud
            document.querySelector('#calle').value= resultado?.address?.Address ?? ''; //llena el input escondido de calle 
            document.querySelector('#lat').value= resultado?.latlng?.lat ?? ''; //llena el input escondido de latitud
            document.querySelector('#lng').value= resultado?.latlng?.lng ?? ''; //llena el input escondido de longitud


        })
    })


})()
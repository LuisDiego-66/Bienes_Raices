/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() { //codigo para mostrar en el mapa las coordenadas   iffi una funcion que se invoca a si misma\r\n\r\n//logical or \r\n    const lat = document.querySelector('#lat').value || -19.0379428;  //recuperamos la latitud si existe y la ponemos como nueva latitud, caso contrario se coloca el valor por defecto\r\n    const lng = document.querySelector('#lng').value || -65.2572107; //son tipos de datos que son strings pero una combinacion con true \r\n    const mapa = L.map('mapa').setView([lat, lng ], 13); //la instancia del mapa\r\n\r\n    let marker; //variable para poner un pin en el mapa\r\n\r\n    //Utilizar provide y GeoCoder\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    //El pin\r\n    marker = new L.marker([lat,lng],{ //el pin es creado en el centro\r\n        draggable:true, //para que el pin se pueda mover\r\n        autoPan :true  // una vez se mueva el mapa lo sigue\r\n    })\r\n    .addTo(mapa)// se agrega el pin a la instancia del mapa\r\n\r\n\r\n    //Detectar el movimiento del pin y leer su latitud y longitud\r\n\r\n    marker.on('moveend', function(even){// captura el evento donde se mueve el pin\r\n\r\n        marker= even.target\r\n        //console.log(marker)\r\n        const posicion = marker.getLatLng();\r\n        console.log(posicion) //muestra las coordenada del pin en la consola\r\n\r\n        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng)) //centra el mapa donde esta el pin\r\n\r\n        //Obtener la informacion de las calles al soltar el pin\r\n        geocodeService.reverse().latlng(posicion,13).run(function(error,resultado){ //Para mostrar la informacion de la calle y metadatos\r\n            //console.log(resultado)\r\n            marker.bindPopup(resultado.address.LongLabel)\r\n\r\n            //llenar los campos escondidos de la latitud y la longitud y la calle\r\n            document.querySelector('.calle').textContent= resultado?.address?.Address ?? ''; //llena el parrafo .calle de la vista crear.pug obteniendo la calle del pin (text.content porque es un parrafo)\r\n            \r\n            //llenando los campos ocultos para recuperar la latitud y la longitud\r\n            document.querySelector('#calle').value= resultado?.address?.Address ?? ''; //llena el input escondido de calle \r\n            document.querySelector('#lat').value= resultado?.latlng?.lat ?? ''; //llena el input escondido de latitud\r\n            document.querySelector('#lng').value= resultado?.latlng?.lng ?? ''; //llena el input escondido de longitud\r\n\r\n\r\n        })\r\n    })\r\n\r\n\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
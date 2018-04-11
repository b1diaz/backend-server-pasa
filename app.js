//Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variables
var app = express();

// Rutas
app.get('/',(req, res,next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    });
});
//Conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/pasaDb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Base de datos: Online');
});

// Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Escuchando en el puerto 3000 Online')
});
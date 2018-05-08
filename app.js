//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inicializar Variables
var app = express();


// Body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas Rutas
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
 

//Conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/pasaDB');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: con la base de datos'));
db.once('open',()=> {
  console.log('Base de datos: Online');
});

//Rutas 
app.use('/login',loginRoutes);
app.use('/usuario',usuarioRoutes);
app.use('/',appRoutes); //esto es un mmiddle

// Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Escuchando en el puerto 3000 Online')
});
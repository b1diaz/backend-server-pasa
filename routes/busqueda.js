//Requires
var express = require('express');

//Inicializando variables
var app = express();

//Importando modelos
var Usuario = require('../models/usuario');
var Materia = require('../models/materia');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// =====================================
// Busqueda por Coleccion
// =====================================
app.get('/:coleccion/:busqueda', (req, res)=>{
    var coleccion = req.params.coleccion;
    var busqueda = RegExp(req.params.busqueda);
    var promesa;

    switch(coleccion){
        case 'Usuario':
        promesa = buscarUsuarios(busqueda);
        break;
        case 'Materia':
        promesa = buscarMaterias(busqueda);
        break;
        case 'Hospital':
        promesa = buscarHospitales(busqueda);
        break;
        case 'Medico':
        promesa = buscarMedicos(busqueda);
        break;
        default:
        return res.status(400).json({
            ok: false,
            mensaje: 'La coleccion '+coleccion+' no existe'
        });
    }
    promesa.then(data =>{
        res.status(200).json({
            ok: true,
            [coleccion]: data
        });
    });

});

// =====================================
// Busqueda general
// =====================================
app.get('/todo/:busqueda',(req,res)=>{ 

    var busqueda = req.params.busqueda;
    var body = req.body;
    busqueda = RegExp(busqueda, 'i');

Promise.all([
    buscarUsuarios(busqueda),
    buscarMaterias(busqueda),
    buscarMedicos(busqueda),
    buscarHospitales(busqueda)
    ]).then( respuesta =>{
    res.status(200).json({
        ok: true,
        usuarios: respuesta[0],
        materias: respuesta[1],
        medicos: respuesta[2],
        hospitales: respuesta[3]
        
    });
} );

});

//----- Buscar usuarios ----
function buscarUsuarios(busqueda){
    return new Promise((resolve, reject)=>{

        Usuario.find({}, 'nombre email rol' )
        .or([{nombre:busqueda},{email:busqueda}])
        .exec((err ,usuarios) =>{
            if(err){
                reject('Error buscando usuarios');
            }
            else{
                resolve(usuarios);
            }
        }) ;
    });   

};
//----- Buscar materias ----
function buscarMaterias(busqueda){
return new Promise((resolve, reject)=>{

    Materia.find({nombre:busqueda},(err,materias)=>{
        if(err){
            reject('Error al cargar Materia',err);
        }else{
            resolve(materias);
        }
        
    });
});   

};

//----- Buscar hospitales ----
function buscarHospitales(busqueda){
return new Promise((resolve, reject)=>{

    Hospital.find({nombre:busqueda},(err,hospitales)=>{
        if(err){
            reject('Error al cargar Hospital',err);
        }else{
            resolve(hospitales);
        }
        
    });
});   

};

//----- Buscar medicos ----
function buscarMedicos(busqueda){
return new Promise((resolve, reject)=>{

    Medico.find({nombre:busqueda},(err,medicos)=>{
        if(err){
            reject('Error al cargar medico',err);
        }else{
            resolve(medicos);
        }
        
    });
});   

};
//------------------------------------------------------

module.exports = app;
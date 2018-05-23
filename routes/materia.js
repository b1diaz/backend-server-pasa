//Requires
var express = require('express');
var mongoose = require('mongoose');
var mAutentication = require('../middlewares/autenticacion');

//Importando Modelo de materia
var Materia = require('../models/materia');

//Inicializando variables
var app = express();

// =====================================
// Obtener todas las materias
// =====================================
app.get('/',(req, res,next)=>{

    var desde = Number(req.query.desde || 0 );

    Materia.find({})
    .skip(desde)
    .limit(5)
    .exec(function(err, materias){
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error buscando maretias - Get'
            });
        }
        Materia.count({},(err,conteo)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error en el conteo de materias - count',
                    err
                });
            }
            res.status(200).json({
                ok: true,
                materias,
                conteo
            });
        });
        
    });
    
});
// =====================================
// Crear materia
// =====================================

app.post('/',mAutentication.verificaToken,(req, res)=>{
    var body = req.body;

    var materia = new Materia({
        nombre: body.nombre,
        img: body.img
    });

    materia.save((err,materiaCreada)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje: 'Error al guardar materia - save',
                err
            });
        }
        res.status(200).json({
            ok:true,
            materiaCreada
        });
    });
});

// =====================================
// Actualizar materia
// =====================================

app.put('/:id',mAutentication.verificaToken, (req,res)=>{

    var body = req.body;
    var id = req.params.id;

    Materia.findById(id,(err, materia)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:'Error buscando materia - put',
                error:err
            });
        }else if(!materia){
            res.status(400).json({
                ok: false,
                mensaje: 'No existe materia buscada',
                error:err
            });
        }

        materia.nombre = body.nombre;
        materia.img = body.img;

        materia.save((err,materiaActualizada)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar materia ',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                materiaActualizada
            });                                                           
        });
    });

});

// =====================================
// Eliminar materia
// =====================================

app.delete('/:id',mAutentication.verificaToken,(req,res)=>{
    var id = req.params.id;

    Materia.findByIdAndRemove(id,(err, materiaBorrada)=>{
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error Borrando materia',
                error: err
            });
        }else if(!materiaBorrada){
            res.status(400).json({
                ok: false,
                mensaje: 'No se encuenta materia - Delete',
                error: err
            });
        }
        res.status(200).json({
            ok: true,
            materiaBorrada
        });
    });
});

module.exports = app;

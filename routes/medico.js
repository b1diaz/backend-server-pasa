//Requires
var express = require('express');
var mongoose = require('mongoose');
var mAutenticacion = require('../middlewares/autenticacion');

//inicializando variables;
 var app = express();

 //Importando modelo de medico
 var Medico = require('../models/medico');


// =====================================
// Obtener todos los medicos
// =====================================
 app.get('/',(req, res)=>{
    var desde = Number(req.query.desde);

     Medico.find({})
     .populate('usuario','nombre email')
     .populate({path:'hospital'})
     .skip(desde)
     .limit(5)
     .exec(function(err, medicos) {
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error buscando medicos - get'
            });
         }

         Medico.count({},(err, conteo)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaj: 'Error en el conteo de medicos - count',
                    err
                });
            }
            res.status(200).json({
                ok: true,
                medicos,
                conteo
            });
         });
        
     });  
 });

// =====================================
// Crear medico
// =====================================

app.post('/',mAutenticacion.verificaToken,(req,res)=>{
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoCreado)=>{
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error creando medico - post',
                error: err
            });
         }
        res.status(200).json({
            ok: true,
            medicoCreado
        });
    });
});

// =====================================
// Actualizar medico
// =====================================
app.put('/:id',mAutenticacion.verificaToken,(req, res)=>{
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id,(err,medico)=>{
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error buscando medico - put',
                error: err
            });
         }else if(!medico){
            res.status(400).json({
                ok: true,
                mensaje: 'No existe medico buscado - put'
            });
         }
        
        medico.nombre = body.nombre,
        medico.img = body.img,
        medico.usuario = req.usuario._id,
        medico.hospital = body.hospital
        
        medico.save((err,medicoActualizado)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error actualizando medico - put',
                    error: err
                });
             }
            res.status(200).json({
                ok: true,
                medicoActualizado
            });

        });
         
    });

});
// =====================================
// Eliminar medico
// =====================================
app.delete('/:id',mAutenticacion.verificaToken,(req,res)=>{
    var id = req.params.id;

    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando medico',
                error: err
            });
         }else if(!medicoBorrado){
            res.status(400).json({
                ok: true,
                mensaje:'No existe medico con el id buscado'
            });
         }
         res.status(200).json({
            ok: true,
            medicoBorrado
        });
    });
});

//exportando
module.exports = app;
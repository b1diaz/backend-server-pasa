// requires
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

//inicialiazar variables

var app = express();

//importando modelo de hospitales
var Hospital = require('../models/hospital');

// =====================================
// Obtener todos los hospitales
// =====================================

app.get('/', (req, res, next)=>{

    var desde = Number(req.query.desde );
    Hospital.find({})
    .populate('usuario','nombre email')
    .skip(desde)
    .limit(5)
    .exec(function(err, hospitales) {
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error busqueda todos los hospitales',
                error: err
            });
        }
        Hospital.count({},(err,conteo)=>{
            if(err){
                res.status(500).json({
                    ok:false,
                    mensaje:'Error en el conteo de Hospitales - count',
                    err
                });
            }
            res.status(200).json({
                ok:true,
                hospital: hospitales
            });
        });
        
    });
    

});

// =====================================
// Crear nuevo hospital
// =====================================
app.post('/',mdAutenticacion.verificaToken,(req,res)=>{

    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalCreado)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:'Error al guadar Hospital',
                error:err
            });
        }
        res.status(200).json({
            ok:true,
            mensaje:'Hospital creado correctamente',
            hospital: hospitalCreado
        });
    });

});

// =====================================
// Actualizar Hospital
// =====================================

app.put('/:id',mdAutenticacion.verificaToken,(req, res)=>{

    var body = req.body;
    var id = req.params.id;

    Hospital.findById(id, (err, hospital)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar  Hospital',
                error: err
            });
        }else if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital no se encuentra en la DB'
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        
        hospital.save((err, hospitalActualizado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Hospital',
                    error: err,
                });
            }
            res.status(200).json({
                ok: true,
                hospitalActualizado
            });
            
        });
    });
});

// =====================================
// Eliminar hospital
// =====================================

app.delete('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar hospital - delete',
                error:err
            });
        }else if(!hospitalBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encuentra hospital buscado'
            });
        }

        res.status(200).json({
            ok:true,
            mensaje: 'Hospital borrado correctamente',
            hospital: hospitalBorrado
        });
    });

});

module.exports = app;
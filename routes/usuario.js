//Requires
var express =  require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

//Importando modelo de usuarios
var Usuario = require('../models/usuario');


// =====================================
// Obtener todos los usuarios
// =====================================
app.get('/',(req, res, next)=>{
    Usuario.find({}, 'nombre email img role',(err, usuarios)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                erros: err
            });
            }
            res.status(200).json({
                ok:true,
                usuarios
            });
        
        })
});

// =====================================
// Crear nuevo usuario
// =====================================

app.post('/',mdAutenticacion.verificaToken,(req,res)=>{

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.imagen,
        role: body.role

    });

    usuario.save( (err, usuarioGuardado)=>{
        if(err){
            res.status(500).json({
                ok:false,
                mensaje: 'Error al guardar usuario',
                error: err
            });
        }
            
            res.status(201).json({
                ok:true,
                usuario: usuarioGuardado
            });

    });

    
    
});

// =====================================
// Actualizar usuario
// =====================================

app.put('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar usuario',
                error: err
            });
        }else if(!usuario){
            return res.status(400).json({
                ok:false,
                mensaje: 'No existe el usuario con el id: '+ id,
                error: {message: 'No existe un usuario con este id'}
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err,usuarioGuardado)=> {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar usuario',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                mensaje: 'Usuario actualizado correctamente'
            })

        });

    });

});

// =====================================
// Eliminar usuario
// =====================================

app.delete('/:id',mdAutenticacion.verificaToken,(req, res, err)=>{
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error bporrando usuario',
                error: err
            });
        }else if(!usuarioBorrado){
            res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario para borrar',
                error: {message: 'No existe usuario'}
            });
        }
        res.status(200).json({
            ok:true,
            mensaje: 'Usuario borrado correctamente',
            usuario: usuarioBorrado
        });
    });

});




module.exports = app;
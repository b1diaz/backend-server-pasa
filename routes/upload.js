//Requires
var express = require('express');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');
var fs = require('fs');

//Inicializando vaiables
var app = express();

//Importando modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var hospitales = require('../models/hospital');
var Usuarios = require('../models/usuario');
var Materia = require('../models/materia');



// default options
app.use(fileUpload()); 

app.put('/:tipo/:id',(req,res)=>{

    var tipo = req.params.tipo;
    var id = req.params.id;
    
    //Tipos de coleccion validos
    var tiposValidos = ['hospitales','medicos','usuarios','materias'];
    if(tiposValidos.indexOf(tipo)<0){
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de collecion no valido',
             error: {message: 'Tipo de collecion no valido'}
        });
    };

    if(!req.files){
        res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido ninguna imagen',
             error: {message: 'debe seleccionar una imagen'}
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    //Extensiones validas para la imagen
    var extensionesValidas = ['png','PNG', 'jpg',, 'JPEG','jpeg','gif','GIF','icon','ICON'];

    if (extensionesValidas.indexOf(extensionArchivo)<0){
        return res.status(400).json({
            ok:false,
            mensaje: 'Extension no valida',
            error: {message: 'Debe selecionar una imagen png, jpg, jpeg, gif, icon'}
        });
    }
    // Nombre de archivo personalizado
    var nombreArchivo = id+"-"+new Date().getMilliseconds()+"."+extensionArchivo;

    //Mover el archivo del temporal a un path
    var path = "./uploads/"+tipo+"/"+nombreArchivo;

    archivo.mv(path, err =>{
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    });


});


function subirPorTipo(tipo, id, nombreArchivo, res){
    if(tipo == 'usuarios'){
        Usuario.findById(id, (err, usuario)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error buscando usuarios ',
                    error: err
                });
            }else if(!usuario){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe usuario con el id '+ id
                });
            }

            var pathViejo = './uploads/usuarios/'+usuario.img;
            // si existe elimina la imagen vieja
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;
            
            usuario.save((err, usuarioActualizado)=>{
                usuarioActualizado.password = ":)";
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioActualizado
                });
            });
        });
    }else if( tipo == 'materias'){
        
        Materia.findById(id,(err,materia)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error buscando usuarios ',
                    error: err
                });
            }else if(!materia){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe materia con el id '+ id
                });
            }

            var pathViejo = './uploads/materias/'+materia.img;
            //si existe elimina la imagen vieja
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            materia.img = nombreArchivo;
            materia.save((err,materiaActualizado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de materia actulizada'
                });
            });


        });
    }
    
} ;



module.exports = app;
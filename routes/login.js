// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
var {OAuth2Client} = require('google-auth-library');
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;



// Inicializando variables
var app = express();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Importando modelos
var Usuario = require('../models/usuario');

// =====================================
// Autenticacion de Google
// =====================================
app.post('/google',(req,res)=>{

    var token = req.body.token;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID, 
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];

        Usuario.findOne({email:payload.emial},(err, usuario)=>{

            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error buscando Usario',
                    error: err
                });
            }
            if(usuario){
                if(usuario.google === false){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debe de usuar su autenticacion normal'
                    });
                }else{
                    usuario.password = ':)';
                    var token = jwt.sign({usuario: usuario},SEED,{expiresIn: 14400}); //4 horas
    
                    res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        token: token,
                        id: usuario._id
                    });
                }
            }else if(!usuario){
                usuario = new Usuario({
                    nombre: payload.name,
                    email: payload.email,
                    password: ':)',
                    img: payload.picture,
                    google: true
                });

                usuario.save((err, usuarioDB)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error guardando usuarioooo',
                            err
                        });
                    }
                    var token = jwt.sign({usuario: usuarioDB},SEED,{expiresIn: 14400}); //4 horas
    
                    res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token,
                        id: usuarioDB._id
                    });
                                    
                });
            }
            
        });
       
      }
      verify().catch(err =>{
          res.status(400).json({
            ok: false,
            mensaje: 'Token incorrecto',
            err
          });
      }) ;
    

});

// =====================================
// Autenticacion Normal
// =====================================
app.post('/',(req, res)=>{
    var body = req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                error: err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                mensaje: 'Errror no se encuantra usuario en la BD - email'
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - Password',
                error: err
            });
        }

        // Token
        usuarioDB.password = ':)';
        var token = jwt.sign({usuario: usuarioDB},SEED,{expiresIn: 14400}); //4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });   
    
});

module.exports = app;
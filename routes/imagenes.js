//Requires
var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');

//Inicializando variables
var app = express();

app.get('/:tipo/:img',(req,res,next)=>{
    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = './uploads/'+tipo+'/'+img;

    fs.exists(path,existe=>{
        if(!existe){
            path = './assets/img/no-image.png';
        }
        res.sendfile(path);
    });

});

module.exports = app;
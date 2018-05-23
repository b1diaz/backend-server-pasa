//Requires
var mongoose = require('mongoose');

//inicializando variables
var Schema = mongoose.Schema;

//Modelo de materia
var materiaSchema = new Schema({
    nombre: {type:String, required:[true, 'El nombre de la materia es requerido']},
    img:{type:String, required:false}
});

module.exports = mongoose.model('Materia',materiaSchema);
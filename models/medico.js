//requires
var mongoose = require('mongoose');

//inicializando variables
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre:{type: String, required:[true, 'El nombre del medico es requerido']},
    img:{type:String, required:false},
    usuario: {type: Schema.Types.ObjectId, ref:'Usuario', required:true},
    hospital: {type: Schema.Types.ObjectId, ref:'Hospital', required:[true, 'El id del hospital es requerido']},

});

module.exports = mongoose.model('Medico',medicoSchema);
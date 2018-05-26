var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE' ,'USER_ROLE'],
    message: '{VALUE} no es un rol admitido '
};

var usuarioSchema = new Schema({
    nombre: {type:String, required:[true,'El nombre es necesario']},
    email: {type:String, unique:true, required:[true,'El Correo es necesario']},
    password: {type:String, required:[true, 'La contraseña en necesaria']},
    img: {type:String, required:false},
    role: {type:String, required:false, default:'USER_ROLE', enum: rolesValidos},
    google:{type:Boolean, required: true, default:false}
});

usuarioSchema.plugin(uniqueValidator,{
    message:'el {PATH} debe ser unico '
});
module.exports = mongoose.model('Usuario',usuarioSchema);
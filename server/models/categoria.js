const mongoose = require('mongoose'); 

const uniqueValidator = require('mongoose-unique-validator'); 

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref:'Usuario' 
    }
});

//usaremos un plugin en particular para el unique-validator
categoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );
//con PATH mongoose inyectara el mensaje de error por nosotros

module.exports = mongoose.model('Categoria', categoriaSchema)
//el nombre q le quiero dar fisicamente al modelo, el cual tendra toda la config de usuarioSchema
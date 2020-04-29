const mongoose = require('mongoose'); 
const uniqueValidator = require('mongoose-unique-validator'); 


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};


let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password:{
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String,
        required: false
    }, 
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false,
    }
});


//el metodo toJSON, en un schema, siempre se llama cuando se intenta imprimir
usuarioSchema.methods.toJSON = function() { //no usar la funcion de flecha xq necesitamos el this
    
    let user = this;
    let userObject = user.toObject(); //de esta manera ya tengo todas las propiedades y metodos
    delete userObject.password;//con esto ya tenemos un objeto q no tiene la contraseña

    return userObject;
}

//usaremos un plugin en particular para el unique-validator
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );
//con PATH mongoose inyectara el mensaje de error por nosotros

module.exports = mongoose.model('Usuario', usuarioSchema)
//el nombre q le quiero dar fisicamente al modelo, el cual tendra toda la config de usuarioSchema
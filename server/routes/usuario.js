const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore'); 

const Usuario = require('../models/usuario'); 
const { verificarToken, verificarADMIN_ROLE } = require('../middlewares/autenticacion'); 

const app = express();

app.get('/usuario', verificarToken, (req, res) => {

    //*** los parametros opcionales caen dentro de un objeto llamado query que esta dentro del req obviamente
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado:true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {

                if ( err ){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                
                Usuario.count({estado:true}, (err, conteo) => { //se debe poner la misma condicion que el find (si quiero poner una obviamente)

                    res.json({
                        ok: true,
                        total: conteo,
                        usuarios,
                    })
                
                });

            } )

});

app.post('/usuario', [verificarToken,verificarADMIN_ROLE], function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre  : body.nombre,
        email   : body.email,
        password: bcrypt.hashSync(body.password, 10), //para encriptar la contraseña
        role    : body.role
    });

    usuario.save( (err, usuarioDB) => {
        
        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null; //para esconder la contra de la resp q da abajo (no recomendado por la simplicidad)

        res.json({ //no se necesita poner el status 200 porq ya esta implicito
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', [verificarToken,verificarADMIN_ROLE], function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado',]);//sin middleware
    

    //lo malo del andUpdate es q no retorna el documento actualizado pero se lo soluciona
    //poniendo el 3er argumento de las opciones. 
    //runValidators es para activar los validators del modelo (Schema)
    Usuario.findByIdAndUpdate( id, body, { new:true, runValidators:true }, (err, usuarioDB) =>{

        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({ //no se necesita poner el status 200 porq ya esta implicito
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', [verificarToken,verificarADMIN_ROLE], function (req, res) {

    let id = req.params.id;
    
    // Usuario.findByIdAndRemove( id, (err, usuarioBorrado) => {

    let estadoCambiado = {
        estado: false
    };

    Usuario.findByIdAndUpdate( id, estadoCambiado, { new:true }, (err, usuarioBorrado) => {
        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if ( !usuarioBorrado ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({ //no se necesita poner el status 200 porq ya esta implicito
            ok: true,
            usuario: usuarioBorrado
        });
    }); 

});

module.exports = app;
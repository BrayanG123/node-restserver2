const express = require('express');

let { verificarToken, verificarADMIN_ROLE } = require('../middlewares/autenticacion');

const Categoria = require('../models/categoria'); 

let app = express();


// ====================================
// 	  Mostrar todas las Categorias
// ====================================
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
             .sort('nombre') //para ordenar alfabeticamente
             .populate('usuario', 'nombre email')   //populate se encarga de ids u ObjectsId existen y permiten cargar la informacion
             .exec(
    
                (err, categorias) => {
                    if ( err ){
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    Categoria.count({}, (err, conteo) => {
                        res.json({
                            ok: true,
                            total: conteo,
                            categorias,
                        })
                    });
                })
});



// ====================================
// 	  Mostrar Categoria por ID
// ====================================
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if ( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({ //no se necesita poner el status 200 porq ya esta implicito
            ok: true,
            categoria: categoriaDB
        });
    });
});



// ====================================
// 	    Crear nueva Categoria
// ====================================
app.post('/categoria', verificarToken, (req, res) => {
    //recordar que tengo el id del usuario en el token
    // req.usuario._id

    let body = req.body;
    let idU = req.usuario._id;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: idU
    });

    categoria.save( {}, (err, categoriaGuardada) => {

        if ( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Categoria creada con exito',
            categoria: categoriaGuardada
        });
    });

});



// ====================================
// 	    Actualizar Categoria
// ====================================
app.put('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let nameCat = {
        nombre: nombre
    }

    Categoria.findByIdAndUpdate(id, nameCat, { new:true, runValidators:true, context:'query' }, (err, categoriaDB) => {

        if ( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if ( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error: Categoria no existe'
                }
            });
        }   

        res.json({
            ok:true,
            categoria: categoriaDB
        });
       
    });

});


// ====================================
// 	        Borrar Categoria
// ====================================
app.delete('/categoria/:id', [ verificarToken, verificarADMIN_ROLE ], (req, res) => {
    //solo administrador puede borrar categorias
    //Eliminar fisicamente

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if ( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error: Categoria no existe'
                }
            });
        }

        res.json({
            ok:true,
            message: 'Categoria eliminada correctamente',
            categoria: categoriaDB
        });

    });
});


module.exports = app;
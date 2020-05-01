const express = require('express');

let { verificarToken, verificarADMIN_ROLE } = require('../middlewares/autenticacion');

const Producto = require('../models/producto'); 

let app = express();


// ====================================
// 	  Mostrar todos los Productos
// ====================================
app.get('/producto', verificarToken, (req, res) => {

    //*** los parametros opcionales caen dentro de un objeto llamado query que esta dentro del req obviamente
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;
    desde = Number(desde);
    limite = Number(limite);

    Producto.find( {disponible:true} )
             .skip(desde)
             .limit(limite)
             .sort('nombre') //para ordenar alfabeticamente
             .populate('categoria', 'nombre')
             .populate('usuario', 'nombre email')   //populate se encarga de ids u ObjectsId existen y permiten cargar la informacion
             .exec(
    
                (err, productos) => {
                    if ( err ){
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    Producto.count({ disponible:true }, (err, conteo) => {
                        res.json({
                            ok: true,
                            total: conteo,
                            productos,
                        })
                    });
                }
            )
});



// ====================================
// 	  Mostrar producto por ID
// ====================================
app.get('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById( id )
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre email')
            .exec(
                (err, productoDB) => {
                    if ( err ){
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    if ( !productoDB ){
                        return res.status(400).json({
                            ok: false,
                            err: {
                                message: 'producto no encontrado'
                            }
                        });
                    }

                    res.json({ //no se necesita poner el status 200 porq ya esta implicito
                        ok: true,
                        producto: productoDB
                    });
                }
            );
});


// ====================================
// 	        Buscar Producto
// ====================================
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //esto es crucial para las busquedas

    Producto.find( {nombre:regex} )
            .populate('categoria', 'nombre')
            .exec(
                (err, productos) => {
                    if ( err ){
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    if ( !productos ){
                        return res.status(400).json({
                            ok: false,
                            err: {
                                message: 'producto no encontrado'
                            }
                        });
                    }

                    res.json({ //no se necesita poner el status 200 porq ya esta implicito
                        ok: true,
                        productos
                    });
                }
            );
});



// ====================================
// 	    Crear nuevo producto
// ====================================
app.post('/producto', verificarToken, (req, res) => {
    // req.usuario._id

    let body = req.body;
    let idU = req.usuario._id;

    //** IMPORTANTE: nosotros debemos ordenar al frontend como debe de mandar los campos (tiene q ser la mismas nomenclaturas que el modelo)
    let producto = new Producto({
        nombre     : body.nombre,
        precioUni  : body.precioUni,
        descripcion: body.descripcion,
        disponible : body.disponible,
        categoria  : body.categoria,
        usuario    : idU,
    });

    producto.save( {}, (err, productoGuardado) => {

        if ( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'producto creado con exito',
            producto: productoGuardado
        });
    });

});



// ====================================
// 	    Actualizar producto
// ====================================
app.put('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    

    Producto.findByIdAndUpdate(id, body, { new:true, runValidators:true, context:'query' }, (err, productoDB) => {

        if ( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if ( !productoDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error: producto no existe'
                }
            });
        }   

        res.json({
            ok:true,
            producto: productoDB
        });
       
    });

});


// ====================================
// 	        Borrar producto
// ====================================
app.delete('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    let disponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponible, { new:true, runValidators:true, context:'query' }, (err, productoDB) => {
        if ( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error: producto no existe'
                }
            });
        }

        res.json({
            ok:true,
            message: 'Producto eliminada correctamente',
            producto: productoDB
        });

    });
});




module.exports = app;
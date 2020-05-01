const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario'); 
const Producto = require('../models/producto'); 

const fs = require('fs'); //tambien tiene q ver con la ruta del archivo
const path = require('path'); //para construir el path que me permita llegar al archivo 

//el middleware
app.use(fileUpload()); //cuando llamamos a esta funcion, todos los archivos que se carguen caen dentro
//de req.files, eso es lo que hace este middleware


//usaremos put en vez de post
app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Ningun archivo seleccionado'
            }     
        });
    }

    //validar tipos
    let tiposValidos = ['usuarios', 'productos'];
    if ( tiposValidos.indexOf( tipo ) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Solo permitido para '+ tiposValidos.join(', ')
            }     
        });
    }
  
    let sampleFile = req.files.archivo;//con este nombre tambien tiene q estar en el postman (archivo) o en el name del input en el template
    let nombreCortado = sampleFile.name.split('.');//para seaparar por puntos y asi poder extraer la extension
    let extension = nombreCortado[nombreCortado.length - 1];

    //Extensiones Validas
    let extValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if ( extValidas.indexOf( extension) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son '+ extValidas.join(', ')
            }     
        });
    }

    
    //cambiar nombre al archivo para evitar conflictos
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;//sera un nombre unico

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) => {

        if (err)
        return res.status(500).json({
            ok: false,
            err //es mejor no personalizar este por la info que puede contener de referencia
        });

        //Imagen ya cargada, solo queda la respuesta
        switch (tipo) {
            case 'usuarios':
                imagenUsuario( id, res, nombreArchivo);
                console.log('Paso por usario');
                break;
            case 'productos':              
                imagenProducto( id, res, nombreArchivo);
                console.log('Paso por producto');
                break;
            default:
                console.log('No paso los cases xd');
                break;
        }
        
    });
});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {
        if (err){
            borrarArchivo(nombreArchivo, 'usuarios');//lo llamamos tambien aqui porque la img ya esta subida antes de llamarse a la funcion y tenemos q borrarla deshaciendo la subida accidental
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuarios');//si el usuario no existe, tengo q borrar la img q se subio por accidente
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        //en caso de que ya exista una imagen, la reemplazaremos (en base de q exista un path a la imagen)
        //1ro verificar que la ruta exista
        // let pathImagen = path.resolve( __dirname, `../../uploads/usuarios/${usuarioDB.img}`);//cada argumento del resolve son segmentos del path q quiero construir
        //aqui confiraremos si el path existe, si no, entonces no hare nada
        // if ( fs.existsSync( pathImagen ) ){//esta funcion retorna true si existe, false caso contrario
            // fs.unlinkSync( pathImagen );// funcion del fyleSystem para borrar archivos (manejar con cuidado)
        // }

        //centralizamos lo de arriba en una funcion para optimizar codigo y reutilizar
        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img : nombreArchivo
            })
        });
    });

}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB) => {
        if (err){
            borrarArchivo(nombreArchivo, 'productos');//lo llamamos tambien aqui porque la img ya esta subida antes de llamarse a la funcion y tenemos q borrarla deshaciendo la subida accidental
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB){
            borrarArchivo(nombreArchivo, 'productos');//si el producto no existe, tengo q borrar la img q se subio por accidente
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img : nombreArchivo
            })
        });
    });
}

function borrarArchivo(nombreImg, tipo){
    let pathImagen = path.resolve( __dirname, `../../uploads/${tipo}/${nombreImg}`);//cada argumento del resolve son segmentos del path q quiero construir
        //aqui confiraremos si el path existe, si no, entonces no hare nada
        if ( fs.existsSync( pathImagen ) ){//esta funcion retorna true si existe, false caso contrario
            fs.unlinkSync( pathImagen );// funcion del fyleSystem para borrar archivos (manejar con cuidado)
        }
}

module.exports = app;
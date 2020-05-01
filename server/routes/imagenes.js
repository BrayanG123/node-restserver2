const express = require('express');
const fs = require('fs');
const path = require('path'); 

const { verificarTokenImg } = require('../middlewares/autenticacion'); 

const app = express();


app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) =>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    //construyendo un path:
    let pathImagen = path.resolve( __dirname, `../../uploads/${tipo}/${img}`);
    
    if ( fs.existsSync(pathImagen) ){
        res.sendFile( pathImagen );
    }else{
        let noImagePath = path.resolve( __dirname, '../assets/no-image-found.jpg');
        //sendFile regresa cualquier archivo leyendo contentType del mismo para tratarlo como tal (img, json, etc)
        res.sendFile(noImagePath);
    }

});


module.exports = app;
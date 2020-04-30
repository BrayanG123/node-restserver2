require('./config/config'); //para obtener el puerto

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 

const app = express();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//habilitar la carpeta public (index.html)
app.use( express.static( path.resolve( __dirname, '../public' ) ) );

 
// Condiguracion global de rutas (usar las rutas)
app.use(require('./routes/index'));


mongoose.connect( process.env.URLDB , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then( () => console.log('Base de Datos ONLINE'))
.catch( err => console.log('No se pudo conectar', err))

 
app.listen( process.env.PORT , () => {
    console.log('Escuchando el puerto', 3000);
});
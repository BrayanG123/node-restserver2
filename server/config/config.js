
// ====================================
// 			    PUERTO
// ====================================
process.env.PORT = process.env.PORT || 3000;


// ====================================
// 			    Entorno
// ====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //si no existe, entonces estoy en desarrollo


// ====================================
// 			Base de Datos
// ====================================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    // urlDB = 'mongodb+srv://brayannode:SG5KfJvvpPab34pG@cluster0-5jeqx.mongodb.net/cafe';
    urlDB = process.env.MONGO_URI; //nuestra variable de entorno creada
}

// el URLDB es inventado
process.env.URLDB = urlDB;



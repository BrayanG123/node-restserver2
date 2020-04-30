
// ====================================
// 			    PUERTO
// ====================================
process.env.PORT = process.env.PORT || 3000;


// ====================================
// 			    Entorno
// ====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //si no existe, entonces estoy en desarrollo


// ====================================
// 		Vencimiento del Token	
// ====================================
// 60min * 60seg * 24hrs * 30dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 ;


// ====================================
// 		SEED de autenticacion		
// ====================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; //el 1er valor viene de heroku (seguridad)

// ====================================
// 			Base de Datos
// ====================================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI; //nuestra variable de entorno creada
}

// el URLDB es inventado
process.env.URLDB = urlDB;


// ====================================
// 		    Google Client ID		
// ====================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '686240586421-b04enks88fsccmncfo842c1m6vamr9hg.apps.googleusercontent.com'; 


const jwt = require('jsonwebtoken'); 



// ====================================
// 			Verificar Token	
// ====================================
let verificarToken = ( req, res, next ) => {

    let token = req.get('token'); //para obtener los headers es con get

    jwt.verify(token, process.env.SEED, (err, decoded) =>{
        if ( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario; // el decoded es el payload que contiene al usuario y otras cosas +
        next();
    });
    
};

// ====================================
// 	    Verificar Token ADMIN_ROLE	
// ====================================
let verificarADMIN_ROLE = ( req, res, next ) => {

    // let usuario = req.usuario;
    let role = req.usuario.role;
    
    if ( role === 'USER_ROLE' ){
        
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No es Administrador'
            }
        });
        
    }

    next();
    
};



module.exports = {
    verificarToken,
    verificarADMIN_ROLE
}


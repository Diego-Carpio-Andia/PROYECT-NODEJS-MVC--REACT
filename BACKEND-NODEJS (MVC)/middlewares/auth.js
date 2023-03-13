const jwt = require("jwt-simple");
const moment = require("moment");

const lib_jwt = require("../services/jwt");
const secret = lib_jwt.secret;

exports.auth = (req,res,next) => {

    if(!req.headers.authorization){
        return res.status(404).json({
            status: "error",
            message: "La peticion no tiene la cabecera de autenticacion"
        })
    }

    let token = req.headers.authorization.replace(/['"]+/g,'');
    try {
        let payload  = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(404).json({
                status: "error",
                message: "token expirado",
            })
        }

        req.user = payload; 
        req.pinga = 1;

    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: "token invalido",
            error: error
        })
    }

    
    next();



}



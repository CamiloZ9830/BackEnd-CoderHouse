const { EError } = require("../../services/customErrors/error.enums");

const errorHandler = (error, req, res, next) => {
    console.log(error.cause);

    switch ( error.code ) {
        case EError.INVALID_TYPES_ERROR:
              res.status(501).send({status: "error", error: error.name})
              break;
                  
              default: 
                res.status(500).send({status: "error", error: "Unhandled Error"})
    }
};

module.exports = {
    errorHandler,
}
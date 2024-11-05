const appErrors = require('./../utils/appErrors');

const handleCastErrorDB = err =>{
    const message = `invlid ${err.path}: ${err.value}.`;
    return new appErrors(message, 400); //to soul purpose of making and using apperror is to mark it as operational orl else we could have simply used new Error(message)
}

function handleDuplicateErrorDB(err){
    const value = err.keyValue["name"];
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new appErrors(message, 400);
}

const handleValidatorErrorDB = err => {
    return new appErrors(err.message, 400);
}

const sendErrDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error : err,        
        stack: err.statck,
        message: err.message
    });
}

const sendErrProd = (err, res) => {
    if(err.isOperational) {
        //known error
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        //unknown error so no leak of info
        console.log(err.message); //ofcourse we want to see what is wrong 
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong, please try again later.'
        });
    }
    
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error = {...err}
        if(error.name === 'CastError'){ error = handleCastErrorDB(error)}
        if(error.code === 11000){ error = handleDuplicateErrorDB(error) }
        if(error.name === 'ValidatorError'){ error = handleValidatorErrorDB(error) }
        sendErrProd(error, res); //overwritten error
    }
}
// this generates an error only when a unhandled route is called
class appErrors extends Error{
    constructor(message, statusCode){
        super(message)

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail':'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = appErrors; //yha se error middleware me jayega bcz express ko pta hai jaise hi error aayega err middleware me bhej do.
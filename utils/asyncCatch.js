//since all the controller functions are async function this means it will return a promise and then and catch so why do we write the catch block for every async function individualy we will use functions

module.exports = fn => { //fn is here passed as an argument and it means the actual async create,update,delete,get function.
    return (req,res,next) => {
        fn(req, res, next).catch(err => next(err)); // this will take any error to the global error handler middleware
    }
};
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const appErrors = require('./utils/appErrors');
const globalErrorHandler = require('./Controllers/errorController');


const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

// 1) Middlewares

app.use(express.json()); 
/*app.use((req, res, next)=>{ 
    console.log("Hello from the middleware");
    next();
});

app.use((req, res, next)=>{
    req.Date = new Date().toISOString();
    next();
});*/

if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
};

app.use(express.static(`${__dirname}/public`)) //to access templates directly in the browser through normal address like in file

// 2) Routes
app.use('/api/v1/tours',tourRouter); 
app.use('/api/v1/users',userRouter);

//Unhandled routes
//maan lo tumhara event loop yha tk aa gya mtlb iss line tk pahuch gya to iska mtlb to yhi hai na ki koi bhi route match nhi khaya upar wala sab kyu ki aak response bhejne ke baad terminate ho jata hai
//to ab hum karenge error handling
app.all('*', (req, res, next) => { //all means sara http request me kaam karega and '*' means ki upar wala 2 route chor ke baaki sara route
    /*res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    });*/

    /*const err = new Error(`Can't find ${req.originalUrl} on this server`); //this is the err.message
    err.statusCode = 404; //this is the err.status
    err.status = 'Not Found'; //this is the err.status*/

    next(new appErrors(`Can't find ${req.originalUrl} on this server`, 404)); // **note**: if we pass a parameter in next() then express considers it as an error and then it will skip everything else and bring the event loop to error handling middleware
}); //this is a middleware
//middle kaam aese krta hai ki jaise hi aak req, res tackle kiya vo apne se uar wala har middleware se bhejta hai therefore ye error handling wala middleware humlog routes ke upar nhi dal skte nhi to sara request me vhi aane lagega

//Error handling
app.use(globalErrorHandler); //this is a error middleware and express knows that it not a normal middleware rather its a error middleware so where ever express finds an error it will skip all middlewares and bring the req, res here

module.exports =app;
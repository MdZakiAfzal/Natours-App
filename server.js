require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

//this is for synchronous error handling
//consoel.log(x) //and x was never defiend then it will give uncaught exception
process.on('uncaughtException',err=>{
  console.log('UNHANDLED exception...');
  console.log(err.name, err.message);
  console.log('Server is being terminated...');
  process.exit(1);
});

const app = require('./app'); //environmet variables ko import krne ke bad hi app ko import krna

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//this is for mongoose 5
/*mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(con =>{
  //console.log(con.connection); every thing con has will be printed by this line
  console.log('Connected to MongoDB Sucessfully!');
})

app.listen(process.env.port || 3000, () => {
    console.log(`Server is running on port ${process.env.port || 3000}...`);
  });*/


//this is for mongoose 8
mongoose.connect(DB)
.then(con =>{
    console.log('Connected to MongoDB Sucessfully!');
})
//.catch(err => {console.log("There was an error connecting to the database!")});
//this is how we can handel promise rejections but we have to do it individually for each promise this way

const server = app.listen(process.env.port || 3000, () => {
  console.log(`Server is running on port ${process.env.port || 3000}...`);
});

//centralised promise rejection
//this is for asynchronous
process.on('unhandledRejection', (err) => {  //event listener for unhandled rejection
  console.log('UNHANDLED REJECTION...');
  console.log(err.name, err.message);
  server.close(() => {  // this will first hadle all pendig request then shut down the server after that
    console.log('Server is being terminated...');
    process.exit(1);
  });
  //process.exit(1); // this will terminate the entire server in an instance
});




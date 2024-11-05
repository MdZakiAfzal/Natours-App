require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../Models/tourModels');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(con =>{
  //console.log(con.connection); every thing con has will be printed by this line
  console.log('Connected to MongoDB Sucessfully!');
})

//reading JSON file data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

//uploading all the data
const UploadData = async ()=>{
    try{
        await Tour.create(tours);//tours is a array so this function will convert each iteration as an individual object
        console.log("DataBase loded successfully!");
    } catch(err){
        console.log(err);
    }
    process.exit();
};

//Deleting all the data
const deleteAllData = async ()=>{
    try{
        await Tour.deleteMany();
        console.log("All data deleted successfully!");
    }catch(err){
        console.log(err);
    }
    process.exit();
};

/*console.log(process.argv);*/// ye basically tumko terminal se baat krvata hai
//upar wala aak array return karega jisme 2 path hoga agar terminal me ye type kiye to <node dev-data/data/import-Dev-Data.js>
//upar wala aak array return karega jisme 2 path aur aak const hoga "--import" agar terminal me ye type kiye to <node dev-data/data/import-Dev-Data.js --import>

if(process.argv[2] === '--import'){
    UploadData();
}else if(process.argv[2] === '--delete'){
    deleteAllData();
}
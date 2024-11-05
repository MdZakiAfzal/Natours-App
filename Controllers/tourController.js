const fs = require('fs');
const Tour = require('./../Models/tourModels');
const ApiFeatures= require('./../utils/apiFeatures');
const asyncCatch = require('./../utils/asyncCatch');
const appErrors = require('./../utils/appErrors');

exports.aliasTopTour = (req, res, next) => {
    req.query.limit='5';
    req.query.sort='-ratingsAverage,price';//we have wriiten the rest of the code to query from DB in our getAllTours method
    req.query.feilds = 'ratingsAverage,price,difficulty,summary,discription';
    next();
};



//Create function for creating a data object
/*exports.createTour = async (req, res)=>{
    try{
        //const newTour = new Tour();
        //newTour.save();
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            "status":'success',
            "data": {newTour}
        });
    }
    catch(err){
        res.status(400).json({
            "status":'Fail',
            "message": err
        });
    }
};*/

exports.createTour = asyncCatch(async (req, res, next)=>{ //no need of next here but just let it be
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        "status":'success',
        "data": {newTour}
    });
});

/*exports.getAllTours = async (req, res)=>{
    try{
        //importing query
        const features = new ApiFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFeilds()
        .pagination();
        //Tour.find() is the query and req.query is the queryString

        //EXECUTE QUERY
        const tours = await features.query;

        //RESPONSE
        res.status(200).json({
            "status":'success',
            "results": tours.length,
            "data": {tours}
        });
    }catch(err){
        console.log(err);
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
}*/

exports.getAllTours = asyncCatch(async (req, res, next)=>{
    //importing query
    const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFeilds()
    .pagination();
    //Tour.find() is the query and req.query is the queryString

    //EXECUTE QUERY
    const tours = await features.query;

    //RESPONSE
    res.status(200).json({
        "status":'success',
        "results": tours.length,
        "data": {tours}
    });
})

/*exports.getTour =async (req,res)=>{
    try{
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            "status":"success",
            "data": {tour} 
        });
    }catch(err){
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
}*/

exports.getTour = asyncCatch(async (req,res, next)=>{
    const tour = await Tour.findById(req.params.id);

    if(!tour){
        //return next(new Error(`Tour not found for this ID: ${req.params.id}`, 404));
        return next(new appErrors('Tour not found with that ID', 404));
    }

    res.status(200).json({
        "status":"success",
        "data": {tour} 
    });
})

/*exports.updateTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            "status":'success',
            "data": {tour}
        });
    }catch(err){
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
};*/

exports.updateTour = asyncCatch(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!tour){
        //return next(new Error(`Tour not found for this ID: ${req.params.id}`, 404));
        return next(new appErrors('Tour not found with that ID', 404));
    }

    res.status(200).json({
        "status":'success',
        "data": {tour}
    });
});

/*exports.deleteTour = async (req, res) => {
    try{
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            "status":'success',
            "data": null 
        });
    } catch (err){
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
};*/

exports.deleteTour = asyncCatch(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if(!tour){
        //return next(new Error(`Tour not found for this ID: ${req.params.id}`, 404));
        return next(new appErrors('Tour not found with that ID', 404));
    }

    res.status(204).json({
        "status":'success',
        "data": null 
    });
});

//Aggregation pipelines
/*exports.getTourStats = async (req, res)=>{
    try{
        const stats = await Tour.aggregate([ //it is necessary to use await here or else it won't work.
            {
                $match: { ratingsAverage: {$gte: 4.5} } // these are all just syntax so nothing can be done
                //isse hi dataset create hota hai for aggregation pipelines
            }, 
            {
                $group: {
                    /*_id: null, //_id: null means overall pura data set me lagega
                    numTours: {$sum: 1}, // this is to calculate the no. of tours
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}*/
/*
                    _id: '$difficulty', //_id: '$difficulty' means difficulty pe group bnaega
                    //_id: {$toUpper: '$difficulty'}, //just for fun it will show difficulty in upper case
                    numTours: {$sum: 1}, // this is to calculate the no. of tours
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {avgPrice: 1} //1 is for assending and -1 is for descending
            }
        ]);

        res.status(200).json({
            "status":'success',
            "data": {stats} 
        });
    } catch(err){
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
};*/

exports.getTourStats = asyncCatch(async (req, res, next)=>{
    const stats = await Tour.aggregate([ //it is necessary to use await here or else it won't work.
        {
            $match: { ratingsAverage: {$gte: 4.5} } // these are all just syntax so nothing can be done
            //isse hi dataset create hota hai for aggregation pipelines
        }, 
        {
            $group: {
                /*_id: null, //_id: null means overall pura data set me lagega
                numTours: {$sum: 1}, // this is to calculate the no. of tours
                numRatings: {$sum: '$ratingsQuantity'},
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'}*/
                _id: '$difficulty', //_id: '$difficulty' means difficulty pe group bnaega
                //_id: {$toUpper: '$difficulty'}, //just for fun it will show difficulty in upper case
                numTours: {$sum: 1}, // this is to calculate the no. of tours
                numRatings: {$sum: '$ratingsQuantity'},
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'}
            }
        },
        {
            $sort: {avgPrice: 1} //1 is for assending and -1 is for descending
        }
    ]);

    res.status(200).json({
        "status":'success',
        "data": {stats} 
    });
});

/*exports.getMonthlyPlans = async (req, res) => { //basically the month which has most tours.
    try{
        const year = req.params.year * 1;
        const plans = await Tour.aggregate([
            /*{
                $unwind: '$startDates' //since startDates aak array hai ye unwind kya karega ki uska har aak element ko aak alag object bna dega isse sara dates bahar aajyega individual hoke
            },
            {
                // Add a new field 'year' extracted from the 'dateField'
                $addFields: {
                  tourYear: { $year: "$startDates" },
                  tourMonth: { $month: "$startDates" }
                }
            },
            {
                $match: {
                    tourYear: year
                }
            },
            {
                $group: {
                    _id: '$tourMonth',
                    numTours: {$sum: 1}
                }
            },
            {
                $sort: {numTours: -1}
            }*/
/*           {
                $unwind: '$startDates'
           },
           {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
           },
           {
                $group: {
                    _id: {$month: '$startDates'},
                    numTours: {$sum: 1},
                    tourNames: { $push: '$name'} //this will return the names of the tour in an array
                }
           },
           {
                $addFields: { month: '$_id' }
           },
           {
                $sort: {numTours: -1}
           },
           {
                $project: {
                    _id: 0, //when the result comes it will hide _id 
                    //month: 1, //it is 1 by default also.
                    //numTours: 1,
                    //tourNames: 1
                }
 
           }
        ]);

        res.status(200).json({
            "status":'success',
            "data": {plans} 
        });
    } catch (err){
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
};*/

exports.getMonthlyPlans = asyncCatch(async (req, res, next) => { //basically the month which has most tours.
    const year = req.params.year * 1;
    const plans = await Tour.aggregate([
        {
            $unwind: '$startDates'
       },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: {$month: '$startDates'},
                numTours: {$sum: 1},
                tourNames: { $push: '$name'} //this will return the names of the tour in an array
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $sort: {numTours: -1}
        },
        {
            $project: {
                _id: 0, //when the result comes it will hide _id 
                //month: 1, //it is 1 by default also.
                //numTours: 1,
                //tourNames: 1
            }
        }
    ]);

    res.status(200).json({
        "status":'success',
        "data": {plans} 
    });
});
const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true, //this will just remove spaces from begining and end only works in string.
        maxLength: [100, 'A tour must have a name less than or equals to 100 characters'],
        minLength: [4, 'A tour must have a name more than or equals to 4 characters']
    },
    duration:{
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'], //this is to restrict the user to select only these values
            message: 'for difficulty choose from easy, medium, difficult.'
        }, 
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'ratingsAverage must be below 5.0'],
        min: [1, 'ratingsAverage must be above 1.0']
    },
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
        type: Number,
        validate: {  //this is a personal validator not in-built
            validator: function(value){ //value is basically equal to what user has input
                return value <= this.price; //true or false
            },
            message: 'Price discount should be less than or equal to the original price.'
        } 
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false //now if client access data from tourSchema it wont be shown to him but it will be there in the DB
    },
    startDates: [Date],
    slug: String,
    secretTour: Boolean
  }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true } //this will make sure that virtual fields are also returned in the response
  }
);

// virtual field
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

//Document middlewares
//pre middleware: runs before .save() or .create() is called
tourSchema.pre('save', function(next) { //this keyword in case of pre document middleware is actually the whole document.
    this.slug = slugify(this.name, { lower: true }); //this will just create the url type of name feild
    next();
});
/*tourSchema.pre('save', function(next) {
    console.log('Saving the document');
    next();
});

//post middleware: runs after.save() or.create() is called
tourSchema.post('save', function(doc, next) {
    // doc keyword in case of post document middleware is actually the whole document.
    console.log('New tour has been saved:', doc);
    next();
});*/ 

//Query Middleware
tourSchema.pre(/^find/, function(next) { 
    this.find({secretTour: {$ne: true}}); //here this means query object/string
    this.start = Date.now(); //here this has his own previous meaning.
    next();
});
tourSchema.post(/^find/, function(docs, next) { 
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    //console.log(docs);
    next();
});

//Aggregation middleware
tourSchema.pre('aggregate', function(next) { 
    console.log(this.pipeline());//here this means aggregation pipeline
    this.pipeline.unshift({$match: {secretTour: {$ne: true}}}); 
    next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
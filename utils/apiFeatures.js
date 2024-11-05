class ApiFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        const queryObj = {...this.queryString}; 
        const excludedFeilds = ['body', 'limit', 'sort', 'feilds', 'page'];
        excludedFeilds.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(){
        if(this.queryString.sort){
            let sortBy = this.queryString.sort; // eg: {sort: 'price,duration'}
            sortBy = sortBy.replace(',',' ');// eg: {sort: 'price duration'}
            this.query = this.query.sort(sortBy); // this sort is actually the in-built function.
        }else{
            this.query = this.query.sort('-createdAt'); 
        }

        return this;
    }

    limitFeilds(){
        if(this.queryString.feilds){
            const fields = this.queryString.feilds.split(',').join(' ');
            this.query = this.query.select(fields);//this is also a inbuilt function from mongoose
        } else{
            this.query = this.query.select('-__v -secretTour -slug');//this will bring everything except __v which is 0 in all cases            
        }

        return this;
    }

    pagination(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);// these are also inbuilt functions of mongoose.

        return this;
    }
}

module.exports = ApiFeatures;
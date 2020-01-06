const advancedResults = (model, populate) => async (req, res, next) => {
  // model and populate are passed to this funtion @ /routes/<resource>.js. 
  // If you used populate in a resource's 'getAllResource' controller method, you'll need to pass the object into the route.
  //  Example: .route('/').get(advancedResults(Vendors, {path: 'products', select: 'name description'}), getAllVendors) 

  // Instantiate a variable that we'll keep adding to as we break down req.query
  let query;

  // Making a copy of req.query to mutate the copy, b/c we'll still need the original req.query below
  const reqQuery = { ...req.query };
  console.log('reqQuery: ', reqQuery)
  // If there are select, sort, page or limit fields in the query, we need to remove it before we do: model.find(JSON.parse(queryStr)), so we don't get an error. At this point reqQuery could look something like: 
  /* 
      {
          vendor_category: { in: 'Spreads' },
          'location.state': 'PA',
          select: 'name,avatar'
       }

  */
  const removeFields = ['select', 'sort', 'limit', 'page'];

  // Loop over removeFields and delete them from reqQuery, if it has them
  removeFields.forEach(param => delete reqQuery[param]);
  console.log('select/sort removed reqQuery: ', reqQuery);

  // After select, sort, page or limit fields have been removed, stringify reqQuery and set it to another variable so we can use the .replace string method on it.
  let queryStr = JSON.stringify(reqQuery);

  // Using string.replace() and some regEx, create Mongo "$" operators: greater than ($gt), greater than or equal to ($gte) etc. These are in case we ever want to query things like prices with comparison operators. Also, '$in' is for querying based on enum fields.
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding the resource. Don't forget to parse the queryStr back into a JSON object for our database. 
  query = model.find(JSON.parse(queryStr));


  // Making use of our select field: (notice we are using the original req.query.select)
  if (req.query.select) {
    //Currently req.query.select looks something like this --> select: 'name,avatar'. In order to use the mongoose .select method --> query.select('name avatar') we need to change 'name,avatar' to 'name avatar'
    let fields = req.query.select.split(',').join(' ');

    query = query.select(fields);
  }

  // Sort. Something similar to the above 'select' if statement.
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // default sort. '-' means sort Z-A
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  // Mongoose skip method allows you to skip over a specified number of documents in a collection.
  // lets say 25 documents per page * 4 total pages = 100 total documents. If we want the documents on page 4, we need to skip past the first 75 documents. (page number 4) - 1 = 3. --> 3*25 = 75 documents to skip over. 
  query = query.skip(startIndex).limit(limit);

  // If we want populate a document/s with fields from a related resource, we'll need to specifiy what to populate here. 
  if (populate) {
    query = query.populate(populate);
  }

  // Executing/awaiting the query
  const results = await query;

  // Pagination result. Tack on a pagination object to our response.
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.advancedResults = {
    success: true,
    count: results.lenth,
    pagination,
    data: results
  }

  console.log(`advancedResults queryStr: `, queryStr);

  next();

};

module.exports = advancedResults;
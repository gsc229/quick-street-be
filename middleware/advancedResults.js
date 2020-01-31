const geocoder = require('../utils/geocoder');

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Making a copy of req.query 
  const reqQuery = { ...req.query };
  console.log('advancedResults reqQuery: '.red, reqQuery)
  if (req.query.populate) {
    populate = { path: req.query.populate }
    console.log('adv.Mw populate', populate);
  }

  if (req.query.populate && req.query.nest) {

    populate = {
      path: req.query.populate,
      populate: {
        path: req.query.nest
      }
    }
  }
  const removeFields = ['select', 'sort', 'limit', 'page', 'populate', 'nest'];

  // Loop over removeFields and delete them from reqQuery if it has them
  removeFields.forEach(param => delete reqQuery[param]);
  console.log('select/sort/page/limit removed reqQuery: ', reqQuery);



  // check for geocode parameters and add location query object: 
  if (req.params.zipcode && req.params.distance) {
    console.log('advancedResults.js, req.params.zipcode'.america, req.params.zipcode, 'req.params.distance: ', req.params.distance)
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth = 3,663 mi / 6,378.1
    const radius = distance / 3963;
    reqQuery.location = { $geoWithin: { $centerSphere: [[lng, lat], radius] } }

    console.log('advancedResults.js added location:  '.yellow.bg, reqQuery)

  }
  // if client wants a single object either a vendor 
  if (req.params.vendorId) {
    reqQuery._id = req.params.vendorId;
  }
  if (req.params.productId) {
    reqQuery._id = req.params.productId;
  }



  let queryStr = JSON.stringify(reqQuery);
  console.log(`advancedResults queryStr: `.yellow, queryStr);

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  console.log(`advancedResults queryStr.replace `.green, queryStr);
  // Finding the resource. . 
  query = model.find(JSON.parse(queryStr));

  // Making use of our select field:
  if (req.query.select) {

    let fields = req.query.select.split(',').join(' ');
    console.log('advancedResults select fields'.blue, typeof fields);
    // note: with select you cannot select and deselect fields at the same time. 
    query = query.select(fields);

  }

  // Sort. Something similar to the above select if statement.
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // default sort. '-' means sort Z-A
    query = query.sort('-createdAt')
  }
  // remove the location to protect vendor's info


  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 75;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }



  // Executing/awaiting the query
  const results = await query;

  // Pagination result
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
  //console.log('advancedMiddleWare.js Final Results', results)
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next();

};

module.exports = advancedResults;
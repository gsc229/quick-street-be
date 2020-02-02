const geocoder = require('../utils/geocoder');

const advancedResults = (model, populate) => async (req, res, next) => {

  // Check to see if a query exists with Object.entries  
  if (!Object.entries(req.query).length && (req.params.vendorId || req.params.productId) && model.modelName !== "ProductImage") {
    console.log(`No query! Sending to controller`.red)
    next();
  } else {
    console.log(`After query check`.blue)
    console.log(`model.modelName`.blue, model.modelName)
    let query;

    // Making a copy of req.query 
    const reqQuery = { ...req.query };
    console.log('advancedResults reqQuery: '.red, reqQuery)

    // looking for populates/nest in the query
    console.log('adv.R.M.W. req.query.populate '.red, req.query.populate)
    if (req.query.populate) {
      if (req.query.popselect) {
        let fields = req.query.popselect.split(',').join(' ');
        console.log('adv.R.M.W popselect -> fields'.yellow, fields)
        populate = { path: req.query.populate, select: fields }
        console.log('adv.Mw populate', populate);
      } else {
        populate = { path: req.query.populate }
        console.log('adv.Mw populate', populate);
      }

    }
    // check for populate, popselect, nest and nestselect in the req.query param and set populate equal to that
    if (req.query.populate && req.query.nest) {
      if (req.query.popselect && req.query.nestselect) {
        let fields = req.query.popselect.split(',').join(' ');
        let nest_fileds = req.query.nestselect.split(',').join(' ');
        populate = {
          path: req.query.populate,
          select: fields,
          populate: {
            path: req.query.nest,
            select: nest_fileds
          }
        }

      } else if (req.query.popselect) {
        let fields = req.query.popselect.split(',').join(' ');
        populate = {
          path: req.query.populate,
          select: fields,
          populate: {
            path: req.query.nest
          }
        }
      } else {
        populate = {
          path: req.query.populate,
          populate: {
            path: req.query.nest
          }
        }
      }
    }
    const removeFields = ['select', 'sort', 'limit', 'page', 'populate', 'nest', 'popselect', 'nestselect'];

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
    // if client wants a single object, vendor or product, or all the images of a vendor or product. 
    if (req.params.vendorId) {
      //ProductImage is queried by: vendor: vendorId
      let reference;
      if (model.modelName === "ProductImage") {
        reference = 'vendor';
      } else reference = '_id';
      reqQuery[reference] = req.params.vendorId;
      console.log('reference', reference);
    }
    if (req.params.productId) {
      let reference;
      if (model.modelName === "ProductImage") {
        reference = 'product';
      } else reference = '_id';
      reqQuery[reference] = req.params.productId;
    }
    if (req.params.imageId) {
      reqQuery._id = req.params.productId;
    }

    let queryStr = JSON.stringify(reqQuery);
    console.log(`advancedResults queryStr: `.yellow, queryStr);
    console.log('model'.yellow, model.modelName)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(`advancedResults queryStr.replace `.green, queryStr);
    // Finding the resource. . 
    query = model.find(JSON.parse(queryStr));

    // Making use of our select field:
    if (req.query.select) {

      let fields = req.query.select.split(',').join(' ');
      console.log('advancedResults select fields'.blue, fields);
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
    console.log('Populate'.red, populate)
    if (populate) {
      query = query.populate(populate);
      populate = "";
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

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
    }
    next();
  }
};

module.exports = advancedResults;
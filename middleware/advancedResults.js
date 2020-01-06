const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Making a copy of req.query 
  const reqQuery = { ...req.query };
  console.log('advancedResults reqQuery: '.red, reqQuery)

  const removeFields = ['select', 'sort', 'limit', 'page'];

  // Loop over removeFields and delete them from reqQuery if it has them
  removeFields.forEach(param => delete reqQuery[param]);
  console.log('select/sort/page/limit removed reqQuery: ', reqQuery);

  let queryStr = JSON.stringify(reqQuery);
  console.log(`advancedResults queryStr: `.yellow, queryStr);

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  console.log(`advancedResults queryStr.replace `.green, queryStr);
  // Finding the resource. . 
  query = model.find(JSON.parse(queryStr));

  // Making use of our select field:
  if (req.query.select) {

    let fields = req.query.select.split(',').join(' ');

    query = query.select(fields);
  }

  // Sort. Something similar as the above select if statement.
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

  res.advancedResults = {
    success: true,
    count: results.lenth,
    pagination,
    data: results
  }

  next();

};

module.exports = advancedResults;
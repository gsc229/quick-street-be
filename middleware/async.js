// there will be async middle ware to handle async functions to make the code DRY.
const asyncHandler = fn => (req, res, next) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next);
}

module.exports = asyncHandler;
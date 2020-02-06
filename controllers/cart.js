const Cart = require("../models/Cart");
const Customer = require("../models/Customer");
const Order = require('../models/Order');
const Product = require("../models/Product");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//const moment = require('moment');


// @desc    Get cart
// @route   GET /api/v1.0/customers/:customerId/cart
// @access  Public
exports.getCart = asyncHandler(async (req, res, next) => {

  console.log("customerId cart controller, line 13", req.params.customerId);

  const cart = await Cart.findOne({
    owner: req.params.customerId
  }).populate("items.item", "name price product_image quantity vendor").populate({
    path: 'items.item',
    populate: { path: 'product_image' }
  });

  console.log('get customers cart 26', cart)

  if (!cart) {
    return next(
      new ErrorResponse(
        `The customer with ID ${req.params.customerId} has not created a cart`,
        404
      )
    );
  }


  res.status(200).json({ success: true, data: cart });
});

// @desc    Create cart to customer
// @route   POST /api/v1.0/customers/:customerId/cart
// @access  Public
exports.addCart = asyncHandler(async (req, res, next) => {
  req.body.owner = req.params.customerId;
  console.log("Creating new cart from customerId", req.body.owner);

  const customer = await Customer.findById(req.params.customerId);
  console.log("what is customer", customer);

  if (!customer) {
    return next(
      new ErrorResponse(
        `No customer with the id of ${req.params.customerId}`,
        404
      )
    );
  }

  const cart = await Cart.findOne({ owner: customer });

  if (!cart) {
    const newCart = await Cart.create(req.body);

    res.status(200).json({
      success: true,
      data: newCart
    });
  } else {
    return next(
      new ErrorResponse(
        `You already have a cart with id ${cart.id} created`,
        400
      )
    );
  }
});

// @desc    Add products to cart
// @route   POST /api/v1.0/customers/:customerId/cart/addtocart
// @access  Public
exports.addItem = asyncHandler(async (req, res, next) => {
  //console.log('add item to cart customerId', req.params.customerId)
  const cart = await Cart.findOne({ owner: req.params.customerId }).populate("items.item", "name price product_image quantity vendor").populate({
    path: 'items.item',
    populate: { path: 'product_image' }
  });

  const product = await Product.findById(req.body.productId).populate('product_image');

  // check if the item was added before
  if (cart) {
    const itemInCart = cart.items.find(
      i => i.item._id.toString() === product._id.toString()
    );

    if (!itemInCart) {
      cart.items.push({ item: product, quantity: req.body.quantity });
    } else {
      itemInCart.quantity += parseInt(req.body.quantity);
    }

    cart.total = cart.items.reduce((acc, item) => {

      console.log('item and acc', item, acc)
      console.log('item.item.price', item.item.price)
      return acc + (item.quantity * item.item.price)

    }, 0)

    cart.total = cart.total.toFixed(2)

    console.log('cart before save 131', cart.items)

    cart.save();

    // console.log('cart object after save 135', cart.items[2].item)

    res.status(200).json({
      success: true,
      message: "Product was added to your cart",
      cart
    });
  } else {
    return next(new ErrorResponse(`shopping cart does not exist`, 400));
  }
});

// @desc    Update products to cart
// @route   PUT /api/v1.0/customers/:customerId/cart/addtocart
// @access  Public
exports.updateQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ owner: req.params.customerId })
    .populate("items.item", "name price product_image quantity vendor")
    .populate({
      path: 'items.item',
      populate: { path: 'product_image' }
    });

  const product = await Product.findById(req.body.productId);

  // check if the item was added before
  if (cart) {
    const itemInCart = cart.items.find(
      i => i.item._id.toString() === product._id.toString()
    );

    if (!itemInCart) {
      cart.items.push({ item: product, quantity: req.body.quantity });
    } else {
      itemInCart.quantity = parseInt(req.body.quantity);
    }

    cart.total = cart.items.reduce((acc, item) => {
      console.log('item and acc', item, acc)
      return acc + (item.quantity * item.item.price)
    }, 0)

    cart.total = cart.total.toFixed(2)

    cart.save();
    res.status(200).json({
      success: true,
      message: "Product was updated to your cart",
      cart
    });
  } else {
    return next(new ErrorResponse(`shopping cart does not exist`, 400));
  }
});



// @desc    Delete products from cart
// @route   DELETE /api/v1.0/customers/:customerId/cart/deleteitem/:productId
// @access  Public
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const product = req.params.productId;
  console.log("product id", product);


  const cart = await Cart.findOne({ owner: req.params.customerId }).populate("items.item", "name price product_image quantity vendor")
    .populate({
      path: 'items.item',
      populate: { path: 'product_image' }
    });


  cart.items = cart.items.filter(item => {
    if (item.item.id !== product) {
      console.log('item id in filter', item.item.id)
      return item;
    }
  })

  cart.total = cart.items.reduce((acc, item) => {
    console.log('item and acc', item, acc)
    return acc + (item.quantity * item.item.price)
  }, 0)

  cart.total = cart.total.toFixed(2)
  console.log('cart in delete item', cart)
  cart.save();
  res.status(200).json({ success: true, data: cart });
});

// @desc    Delete cart
// @route   DELETE /api/v1.0/cart/:cartId
// @access  Private
exports.deleteCart = asyncHandler(async (req, res, next) => {
  console.log(`called`);
  const cart = await Cart.findOneAndDelete({ _id: req.params.cartId });
  console.log(req.params.cartId);
  console.log(cart);


  if (!cart) {
    return next(new ErrorResponse(`Cart not found`, 404));
  }
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add payment
// @route   POST /api/v1.0/customers/:customerId/cart/payment
// @access  Private
exports.addPayment = asyncHandler(async (req, res, next) => {

  //let totalPrice = Math.round(req.body.totalPrice * 100); // we get this from total price which is sent from the front end

  const customerObj = await Customer.findById(req.params.customerId)

  console.log('cart.js 234 req.body:'.yellow, req.body, 'cart.js 234 customerObj: '.yellow, customerObj.toString().blue)

  stripe.customers // create the customer by passing the email of that ser
    .create({
      email: customerObj.email
    })
    .then(customer => { // once the customer is created, then we create a source of the customer, the source is the information of the users card information, which we get from the front end

      console.log('customer 236', customer)
      return stripe.customers.createSource(customer.id, {
        source: req.body.token.id // token visa -- testing token --> will change when in production
      });

    })
    .then(source => { // after we have created a source, we then want to charge the user, only if the card is valid
      console.log('source 244', source)
      return stripe.charges.create({
        amount: req.body.totalPrice, // passing in the amount which is the total price of the cart
        currency: req.body.currency,
        customer: source.customer // passing in the source object (the users card)
      })
    })
    .then(async charge => { // once we have charged the card, we want to pass in any custom logic. We want to create a new order object and then get the cart data from the front end

      console.log('charge 248', charge)
      const cart = await (await Cart.findOne({ owner: req.params.customerId })).populate('items.item');

      let newOrder = new Order();
      newOrder.owner = req.params.customerId;
      newOrder.items = cart.items;
      newOrder.total = cart.total;

      newOrder = await newOrder.save();
      cart.items = []
      cart.total = 0
      await cart.save();

      console.log('new order 262', newOrder)

      console.log('cart obj after clear 262', cart)

      if (newOrder) {
        res.status(201).json({
          success: true,
          message: 'Order was successfully added',
          order: newOrder
        })
      } else {
        return next(new ErrorResponse('Could not create your order', 404))
      }

    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: 'Payment Failed'
      })
    })

});

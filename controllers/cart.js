const Cart = require("../models/Cart");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const stripe = require('stripe') (process.env.STRIPE_PUBLISHABLE_KEY);


// @desc    Get cart
// @route   GET /api/v1.0/customers/:customerId/cart
// @access  Public
exports.getAllCarts = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
})


// @desc    Get cart
// @route   GET /api/v1.0/customers/:customerId/cart
// @access  Public
exports.getCart = asyncHandler(async (req, res, next) => {
    console.log("customerId cart controller, line 13", req.params.customerId);

    const cart = await Cart.findOne({
        owner: req.params.customerId
    }).populate("items.item", "name price product_image");

    if (!cart) {
        return next(
            new ErrorResponse(
                `No customer with id ${req.params.customerId} owns this cart`,
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
  const cart = await Cart.findOne({ owner: req.params.customerId }).populate(
    "items.item",
    "name price diet description category vendor product_image"
  );

  const product = await Product.findById(req.body.productId);

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

    cart.total = (
      cart.total +
      parseFloat(product.price) * parseInt(req.body.quantity)
    ).toFixed(2);

    cart.save();
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
exports.updateItemAfterSwitchVendor = (req, res, next) => {
    Cart.findOne({ owner: req.params.customerId }, function (err, cart) {
        cart.items = [];
        cart.items.push({
            item: req.body.productId,
            price: parseFloat(req.body.price),
            quantity: parseInt(req.body.quantity)
        });

        cart.total = (cart.total + parseFloat(req.body.price)).toFixed(2);

        cart.save();
    });

  res
    .status(200)
    .json({ success: true, message: `The product was updated successfully`, data: cart });
};

// @desc    Delete products from cart
// @route   DELETE /api/v1.0/customers/:customerId/cart/deleteitem/:productId
// @access  Public
exports.deleteItem = (req, res, next) => {
    const product = req.params.productId;
    console.log("product id", product);

    Cart.findOne({ owner: req.params.customerId }, function (err, cart) {
        cart.items = cart.items.filter(item => {
            if (item.item.toString() !== product) {
                return item;
            }
        });

        cart.save();
    });

    res.status(200).json({ success: true, data: {} });
};

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


exports.addPayment = asyncHandler(async (req, res, next) => {

    const stripeToken = req.body.stripeToken; //first we receive a stripe token 
    const currentCharges = Math.round(req.body.stipePayment * 100) // converting to dollars

    stripe.customers.create({ //create a customer and view as admin
        source: stripeToken,
    }).then(function(customer) { // then charge the customer
        return stripe.charges.create({
            amount: currentCharges,
            currency: 'usd',
            customer: customer.id // make sure it's the right customer youre charging
        }).then(function(charge) { 
            async.waterfall([
                function(cb) {
                    Cart.findOne({ owner: req.params.customerId }, function(err, cart) {
                        cb(err, cart)
                    })
                },
                function(cart, cb) {
                    Customer.findOne({ _id: req.params.customerId}, function(err, customer) {
                        if(customer) {
                            for (let i = 0; i < cart.items.length; i++) {
                                customer.history.push({
                                    item: cart.items[i].item,
                                    paid: cart.items[i].item.price
                                })
                            }
                            customer.save(function(err, customer) {
                                if(err) return next(err);
                                cb(err, customer)
                            })
                        }
                    })
                },
                function(customer, cb) {
                    Cart.update({ owner: customer.customerId}, {$set: { items: [], total: 0}}, function(err, updated) {
                        if(updated) {
                           res.send({message: 'success'})
                        }
                    })
                }
            ])
        })
    })
});


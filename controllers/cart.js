const Cart = require("../models/Cart");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get cart
// @route   GET /api/v1.0/customers/:customerId/cart
// @access  Public
exports.getCart = asyncHandler(async (req, res, next) => {
<<<<<<< HEAD
  console.log("customerId", req.params.customerId);

  const cart = await Cart.findOne({
    owner: req.params.customerId
  }).populate("items.item", "name price");

  if (!cart) {
    return next(
      new ErrorResponse(
        `No customer with id ${req.params.customerId} owns this cart`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: cart });
=======
    console.log('customerId cart controller, line 13', req.params.customerId)

    const cart = await Cart.findOne({
        owner: req.params.customerId,
    })
    .populate('items.item', 'name price');

    if(!cart) {
        return next(new ErrorResponse(`No customer with id ${req.params.customerId} owns this cart`, 404))
    }

    res.status(200).json({ success: true, data: cart });
>>>>>>> cadfa4769db3a93638ace468a77dc2825545f370
});

// @desc    Create cart to customer
// @route   POST /api/v1.0/customers/:customerId/cart
// @access  Public
exports.addCart = asyncHandler(async (req, res, next) => {
  req.body.owner = req.params.customerId;
  console.log("Creating new cart from customerId", req.body.owner);

  const customer = await Customer.findById(req.params.customerId);

  if (!customer) {
    return next(
      new ErrorResponse(
        `No customer with the id of ${req.params.customerId}`,
        404
      )
    );
  }

  const cart = await Cart.create(req.body);

  res.status(200).json({
    success: true,
    data: cart
  });
});

<<<<<<< HEAD
// @desc    Add products to cart
// @route   POST /api/v1.0/:customerId/addtocart
// @access  Public
exports.addItem = (req, res, next) => {
  Cart.findOne({ owner: req.params.customerId }, function(err, cart) {
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
    .json({ success: true, message: "Product was added to your cart" });
};

// @desc    update products to cart
// @route   PUT /api/v1.0/:customerId/addtocart
// @access  Public

exports.updateCart = (req, res, next) => {
  Cart.findOne({ owner: req.params.customerId }, function(err, cart) {
    cart.items = [];
    cart.items.push({
      item: req.body.productId,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity)
    });
=======
    const customer = await Customer.findById(req.params.customerId);
    console.log('what is customer', customer)

    if(!customer) {
        return next(new ErrorResponse(`No customer with the id of ${req.params.customerId}`, 404))
    }

    const cart = await Cart.findOne({ owner: customer })

    if(!cart) {
        const newCart = await Cart.create(req.body);

        res.status(200).json({
            success: true,
            data: newCart
        });
    } else {
        return next(new ErrorResponse(`You already have a cart with id ${cart.id} created`, 400))
    }
    
})

// @desc    Add products to cart
// @route   POST /api/v1.0/customers/:customerId/cart/addtocart
// @access  Public
exports.addItem = (req, res, next) => {
//console.log('add item to cart customerId', req.params.customerId)
    Cart.findOne({ owner: req.params.customerId}, function(err, cart) {
        
        console.log('does cart exists', cart)
    
        cart.items.push({
            item: req.body.productId,
            price: parseFloat(req.body.price),
            quantity: parseInt(req.body.quantity)
        })

        cart.total = (cart.total + parseFloat(req.body.price)).toFixed(2);

        cart.save();
    
        })

res.status(200).json({ success: true, message: 'Product was added to your cart'}, )
    
    }


// @desc    Update products to cart
// @route   PUT /api/v1.0/customers/:customerId/cart/addtocart
// @access  Public
exports.updateItem = (req, res, next) => {

    Cart.findOne({ owner: req.params.customerId}, function(err, cart) {

        cart.items = [];
        cart.items.push({
            item: req.body.productId,
            price: parseFloat(req.body.price),
            quantity: parseInt(req.body.quantity)
        })
>>>>>>> cadfa4769db3a93638ace468a77dc2825545f370

    cart.total = (cart.total + parseFloat(req.body.price)).toFixed(2);

    cart.save();
  });

<<<<<<< HEAD
  res
    .status(200)
    .json({ success: true, message: "Cart was updated with new items" });
};
=======
res.status(200).json({ success: true, message: `The product was updated successfully`})
        
}


// @desc    Delete products from cart
// @route   PUT /api/v1.0/customers/:customerId/cart/deleteitem/:productId
// @access  Public
exports.deleteItem = (req, res, next) => {
    const product = req.params.productId;
    console.log('product id', product)

    Cart.findOne({ owner: req.params.customerId}, function(err, cart) {

        cart.items = cart.items.filter(item => {
            if(item.item.toString() !== product) {
                return item;
            }
        })

        cart.save();
    
        })

res.status(200).json({ success: true, data: {} })
        
}
>>>>>>> cadfa4769db3a93638ace468a77dc2825545f370

// @desc    Delete cart
// @route   DELETE /api/v1.0/customers/:customerId/cart
// @access  Private
exports.deleteCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete(req.body.items);

  if (!cart) {
    return next(new ErrorResponse(`Cart not found`, 404));
  }

  cart.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

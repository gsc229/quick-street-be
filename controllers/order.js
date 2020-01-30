
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
//const verifyToken = require('../middlewares/verify-token');

exports.getOrder = asyncHandler (async (req, res) => {
    console.log(req.params.customerId)
    try {
        let orders = await Order.find({ owner: req.params.customerId }).deepPopulate('owner items.productID.vendor') 

       
        
        res.status(200).json({
            success: true,
            orders: orders
        })


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

exports.createOrder = asyncHandler(async (req, res) => {
    const cart = await (await Cart.findOne({ owner: req.params.customerId })).populate('items.item');
   let newOrder = new Order();
   newOrder.owner = req.params.customerId;
   newOrder.items = cart.items;
   newOrder.total = cart.total;

   newOrder = await newOrder.save();

   if(newOrder) {
    res.status(201).json({
        success: true,
        message: 'Order was successfully added'
    })
   } else {
        return next(new ErrorResponse('Could not create your order', 404))
   }
})


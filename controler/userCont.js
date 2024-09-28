const Product = require('../models/food');
const User = require('../models/user');
const Order = require('../models/order');
const stripe = require('stripe')('sk_test_51PICjRG6Qc0pxCXDaPi8JJRJxZqjzoW5GG4S3is6fujL5jyBda2t6oCddDCcHKMAA8SOzkeGlacFoDPR1czb9hse00DouopulN')

exports.foodlist = async (req, res, next) => {
    try {
        const data = await Product.find();
        res.status(200).json({
            message: 'Data fetched successfully',
            data: data,
        });
    } catch (err) {
        // Handle errors
        next(err); // Pass error to the next middleware
    }
};

exports.foodDetail = async (req, res, next) => {
    const foodId = req.params.foodId;
    try {
        const foodDetail = await Product.findById(foodId);
        if (!foodDetail) {
            const error = new Error('Food not found.');
            error.statusCode = 404;
            throw error;
        }
        res.json({
            message: 'Food detail fetched successfully',
            data: foodDetail,
        });
    } catch (err) {
        // Handle errors
        next(err); // Pass error to the next middleware
    }
};

exports.postaddCart = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const product = await Product.findById(prodId);
        if (!product) {
            const error = new Error('Product not found.');
            error.statusCode = 404;
            throw error;
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        const cart = await user.addtoCart(product);
        res.json({
            success: true,
            cart: cart,
        });
    } catch (err) {
        // Handle errors
        next(err); // Pass error to the next middleware
    }
};

exports.deleteCart = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        const cart = await user.removeCart(prodId);
        res.json({
            success: true,
            cart: cart,
        });
    } catch (err) {
        // Handle errors
        next(err); // Pass error to the next middleware
    }
};

exports.checkout = async (req, res, next) => {
    let products;
    let totalPrice = 0;
    console.log('User data:', req.user);
    try {
        const user = await User.findById(req.user.userId).populate('cart.items.productId');
         // Use populate directly and await it
         console.log(user.cart.items);
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        products = user.cart.items;
        products.forEach(p => {
            totalPrice += p.quantity * p.productId.price;
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map(p => {
              return {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: p.productId.title,
                    description: p.productId.description,
                  },
                  unit_amount: p.productId.price * 100,
                },
                quantity: p.quantity,
              };
            }),
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/success/checkout?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: req.protocol + '://' + req.get('host') + '/success/cancel',
          });
      
          res.json({ id: session.id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.checkoutsuccess = async (req, res, next) => {
    try {
        const sessionId = "cs_test_a1Z2QwvEvsRU7rnousLVjGwkUOllYpm56P8rhYNbDGKJkOjli6LpcFfq3g"
        if (!sessionId) {
            const error = new Error('Session ID is missing.');
            error.statusCode = 400;
            throw error;
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            const error = new Error('Session not found.');
            error.statusCode = 404;
            throw error;
        }

        // Find the user and populate cart items
        const user = await User.findById(req.user.userId).populate('cart.items.productId');
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        // Map user's cart items to order products
        const products = user.cart.items.map(items => ({
            quantity: items.quantity,
            product: { ...items.productId._doc }
        }));

        // Create and save the order
        const order = new Order({
            userId: req.user.userId,
            user: {
                email: user.email,
                name: user.username,
                address: user.address,
                phone: user.phoneNo,
            },
            products: products,
        });

        const orderdata = await order.save();

        // Clear the user's cart
        user.cart.items = [];
        await user.save();

        // Send success response
        res.json({
            message: 'Order saved successfully',
            order: orderdata,
        });
    } catch (err) {
        // Log the error for debugging
        console.error('Error in checkout success handler:', err);

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

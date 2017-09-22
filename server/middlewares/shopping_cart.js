let _       = require('lodash');
let async   = require('async');
const COUPON_CODE = 'your_code';

exports.buildCart = (item_add_cart, req, res, next) => {
    let coupon_code = req.session.coupon_code || null;
    //console.log(req.body);

    let products = [];
    if(req.session.cart){
        if(req.session.cart.items){
            products = req.session.cart.items;
        }
    }
    if(item_add_cart){
        item_add_cart.price_discount = _.round(item_add_cart.price_discount, 2);
        products.push(item_add_cart);
    }

    let cart = {
        items: products,
        subtotal: _.sumBy(products, 'price')
    };
    //console.log(cart);

    cart.discounts = {};
    cart.discounts.items = [];
    cart.discounts.total = 0;

    cart.coupon_code = coupon_code;
    applyCoupon(res, coupon_code, cart);

    discountHandle(cart);

    shippingCost(cart);

    cart.tax = 0;

    cart.total = _.round(cart.subtotal - cart.discounts.total + cart.ship_cost + cart.tax, 2);
    //console.log(cart);
    req.session.cart = cart;
    if(coupon_code && coupon_code !== COUPON_CODE){
        res.send('coupon_valid');
    }
    else {
        res.send(cart);
    }
};

let applyCoupon = (res, coupon, cart) => {
    //Update cart items
    //require('../helpers/promotions/')(cart);
    switch (coupon){
        case COUPON_CODE:
            //require('../helpers/promotions/discount_code')(cart);
            break;
        default:
            break;
    }
};

let discountHandle = (cart) => {
    cart.discounts.total = _.sumBy(cart.items, 'price_discount');

    if(cart.discounts.items){
        cart.discounts.total += _.sumBy(cart.discounts.items, 'discount');
    }
    cart.discounts.total = _.round(cart.discounts.total, 2);
};

let shippingCost = (cart) => {
  cart.ship_cost = 0;
};

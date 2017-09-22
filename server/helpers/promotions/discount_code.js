/**
 * Created by vandoan on 7/13/17.
 */

module.exports = (cart) => {
    let discountTotal = 0;
    for(let i of cart.items){
        discountTotal += i.price_special * 10 / 100;
    }
    //console.log(discountTotal);
    cart.discounts.items.push({name: 'Save Off 10%', discount:discountTotal});
    //console.log(cart);
};
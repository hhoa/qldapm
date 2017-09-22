const mongoose = require('mongoose');
const schema = mongoose.Schema;
const hash = require('../helpers/hash');

var account_schema = new schema({
    username : String,
    password :  String,
    gender: String,
    birth_day: String,
    first_name : String,
    last_name : String,
    email : String,
    phone : {
        home: String,
        mobile: String
    },
    address : Array,
    company: String,
    VAT: String,
    user_type : String,
    status : Boolean,
    last_update: String,
    date_join: String,
    orders: Array,
    wish_list: Array
});

account_schema.methods.validPassword = (password, password_has) => {
    let output = hash(password);
    if(output === password_has)
        return true;
    return false;
};

module.exports = mongoose.model('account', account_schema, 'accounts');

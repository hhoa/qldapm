const mongoose = require('mongoose');
const schema = mongoose.Schema;

var admins_schema = new schema({
    username: String,
    password: String,
    email: String,
    first_name: String,
    last_name: String,
    permission: Boolean
});

module.exports = mongoose.model('admin', admins_schema, 'admins');
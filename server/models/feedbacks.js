const mongoose = require('mongoose');
const schema = mongoose.Schema;

let feed_back_schema = new schema({
    name: String,
    email: String,
    phone: String,
    message: String
});

module.exports = mongoose.model('feedback', feed_back_schema, 'feedbacks');

const mongoose = require('mongoose');
const schema = mongoose.Schema;

let qa_schema = new schema({
    q: String,
    a: String,
    url: String
});

module.exports = mongoose.model('qa', qa_schema, 'qa');
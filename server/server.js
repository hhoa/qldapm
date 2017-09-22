
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const connect_string = 'mongodb://localhost:27017/workweb';
const secret = 'gqNWmK+Ux0NJ8eRP4QSatw2FGFbMvqt9FMKddhaQkjk=';
const app = express();
mongoose.connect(connect_string);

const api = require('./routes/api');

//view engine
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));
app.use((req, res, next) =>  { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname, '../dist')));
app.use(cookie_parser(secret));
app.use(session({
    secret: secret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14, /* 2 week */
    },
    store: new MongoDBStore({
        uri: connect_string,
        collection: 'WorkWebSessions'
    }),
    resave: true,
    saveUninitialized: true
}));

app.use('/api', api);

app.get('*', (req, res) => {
    res.render(path.join(__dirname, '../dist/app/index.html'));
});

const port = 3000;
app.set('port', port);

app.listen(port);

module.exports = app;

const express    = require('express');
const router     = express.Router();
const lodash     = require('lodash');
const fs         = require('fs');
const path       = require('path');
const jwt        = require('jwt-simple');
const _          = require('underscore');
const async      = require('async');
const nodemailer = require('nodemailer');
const multer     = require('multer');

/*model*/
const FeedBack = require('../models/feedbacks');

/* config */
const hash   = require('../helpers/hash');
const secret = require('../helpers/configuration.string').secret;

const app = express();
app.set('jwtTokenSecret', secret);

let tokens = [];
let removeFromTokens = (token) => {
    for (let counter = 0; counter < tokens.length; counter++) {
        if (tokens[counter] === token) {
            tokens.splice(counter, 1);
            break;
        }
    }
};

let authenticate = (req) => {
    if(req.session.admin){
        return true;
    }
    return false;
};

let upload_file_name = "";
let storage = multer.diskStorage({ //multers disk storage settings
    destination: (req, file, cb) => {
        let firstChar       = file.originalname.trim().charAt(0).toLocaleLowerCase();
        let pathImage       = "./dist/media/products/base/" + firstChar;

        try{
            fs.statSync(pathImage);
        }
        catch(e) {
            fs.mkdirSync(pathImage);
        }

        cb(null, pathImage);
    },
    filename: (req, file, cb) => {
        let filename = file.originalname.toLocaleLowerCase().replace(/ /g, "-");
        filename = encodeURIComponent(filename);
        let parseFile = path.parse(filename);
        upload_file_name = parseFile.name + "-" + Date.now() + parseFile.ext;
        cb(null, upload_file_name);
    }
});

let upload = multer({ //multer settings
    storage: storage
}).single('file');

/* GET api listing. */
router.get('/', (req, res, next) => {

});

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = hash(req.body.password);

    Account.findOne({
        username: username,
        password: password
    }, (err, doc) => {
        if(err){
            console.log(err);
        }
        else {
            /* founded */
            if(doc !== null) {
                let expires = Math.round((new Date().getTime()/1000)) + 3600;
                let token = jwt.encode({
                    username: username,
                    expires: expires
                }, app.get('jwtTokenSecret'));

                tokens.push(token);

                let user = {
                    access_token: token,
                    username: username
                };
                req.session.user = user;

                res.send(200, user);
            }
            else {
                res.send(401, "Invalid credentials");
            }

        }
    });
});

router.post('/logout', (req, res) => {

    if(req.session.user){
        req.session.user = null;
        let token = req.body.access_token;
        removeFromTokens(token);
        res.send(200);
    }
});

/* -------------------------- ADMIN ------------------------------- */
router.post('/admin/login', (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    Admin.findOne({username: username}, (err, doc) => {
        if(err){
            console.log(err);
        } else {
            let password_hash = hash(password);
            if(password_hash === doc.password) {
                let expires = new Date();
                expires.setDate((new Date()).getDate());
                let token = jwt.encode({
                    username: username,
                    expires: expires
                }, app.get('jwtTokenSecret'));

                let admin = {
                    access_token: token,
                    username: username
                };
                request.session.admin = admin;

                tokens.push(token);

                response.send(200, admin);
            } else {
                response.send(401, "Invalid credentials");
            }
        }
    });
});

router.get('/admin/check-authentication', (req, res) => {
   if(authenticate(req)){
       //kiểm tra hết hạn
       res.jsonp({
           checked: true,
           admin: req.session.admin
       });
   } else {
       res.jsonp({checked: false});
   }
});

router.post('/admin/logout', (req, res) => {
    if(authenticate(req)){

        let token = req.headers.access_token;

        removeFromTokens(token);

        req.session.admin = null;

        res.send(200);

    } else {
        res.send(304);
    }
});

router.get('/admin/admins/get', (req, res) => {
    if(authenticate(req)){

        Admin.find((err, docs) => {
            res.jsonp(docs);
        });

    }
});

router.get('/admin/admins/details/:username', (req, res) => {
    if(authenticate(req)){

        Admin.find({username: req.params.username}, (err, docs) => {
            res.jsonp(docs[0]);
        });

    }
});


router.post('/admin/admins/add', (req, res) => {
    if(authenticate(req)){

        let new_account = new Admin(req.body);
        new_account.password = hash(new_account.password);
        new_account.save((err) => {
            if(err){
                console.log(err);
            }
            res.send(200);
        });

    }
});

router.post('/admin/admins/update', (req, res) => {
    if(authenticate(req)){

        let account = req.body.update;
        let old_pass = req.body.old_pass;

        if (!old_pass){
            account.password = hash(account.password);
        }
        let condition = { username: account.username };
        Admin.findOneAndUpdate(condition, account, {new: true}, (err, docs) => {
            if(err){
                console.log(err);
            }
        });

    }
});


router.post('/admin/admins/delete', (req, res) => {
    if(authenticate(req)){

        if (req.body.permission){
            console.log('This is admin permission!');
        }
        else {
            Admin.remove({ username: req.body.username }, (err) => {
                if(err){
                    console.log(err);
                }
                else {
                    console.log('Removed!');
                }
            });
        }

    }
});

router.get('/admin/get-authentication', (req, res) => {
    if(authenticate(req)){
        res.jsonp(req.session.admin);
    } else {
        res.jsonp(null);
    }
});

router.get('/admin/profile/:username', (req, res) => {
    if(authenticate(req)){
        Admin.findOne({username: req.params.username}, (err, doc) => {
            if(err){
                console.log(err);
            } else {
                res.jsonp(doc);
            }
        });
    }
});

router.post('/admin/customers/add', (req, res) => {
    if(authenticate(req)){
        let customer = req.body;
        let date = new Date().getTime();

        let new_account = new Account(customer.account);
        new_account.password = hash(new_account.password);
        new_account.save((err) => {
            if(err){
                console.log(err);
            }
            else {
                res.send(200);
            }
        });
    }
});

router.post('/admin/customers/update', (req, res) => {

    if(authenticate(req)){
        let customer = req.body;

        let account = customer.update;
        let old_pass = customer.old_pass;
        if (!old_pass){
            account.password = hash(account.password);
        }
        let condition = { username: account.username };
        Account.findOneAndUpdate(condition, account, {new: true}, (err, docs) => {
            if(err){
                console.log(err);
            }
            else {
                res.send(200);
            }
        });
    }

});

router.post('/admin/customers/delete', (req, res) => {
    if(authenticate(req)){

        let customer = req.body;

        //remove at username
        Account.remove({ username: customer.username }, (err) => {
            if(err){
                console.log(err);
            }
            else {
                res.send(200);
            }
        });
    }
});

/* contact us send feedback */
router.post('/feed-back/save', (req, res) => {
    let content = req.body;

    let newFeedBack = new FeedBack(content);
    newFeedBack.save((err) => {
        if(err){
            console.log(err);
        } else {
            res.send(200);
        }
    });
});

router.get('/qa', (req, res) => {
    let qa = require('../models/qa');
    qa.find((err, docs) => {
        res.jsonp(docs);
    });
});


/*------------------ faq -------------------*/
router.get('/admin/get-qa', (req, res) => {
    QA.find((err, docs) => {
        res.jsonp(docs);
    });
});

router.post('/admin/qa/add', (req, res) => {
    if(authenticate(req)){
        let new_qa = new QA(req.body.qa);
        new_qa.save((err) => {
            if(err) {
                console.log(err);
            } else {
                res.send(200);
            }
        });
    }
});

router.post('/admin/qa/update', (req, res) => {
    if(authenticate(req)){
        let qa = req.body.qa;
        let condition = {
            _id: qa._id
        };
        QA.findOneAndUpdate(condition, qa, {new: true}, (err, docs) => {
            if(err){
                console.log(err);
            } else {
                res.send(200);
            }
        });
    }
});

router.post('/admin/qa/delete', (req, res) => {
    if(authenticate(req)){
        let qa = req.body.qa;
        QA.remove({ _id: qa._id }, (err) => {
            if(err){
                console.log(err);
            }
            else {
                res.send(200);
            }
        });
    }
});

router.get('/get-qa/:params', (req, res) => {

    let condition = {};
    if(req.params.params !== "undefined"){
       condition = { url: 'qa/' + req.params.params };
    }
    QA.find(condition, (err, docs) => {
        res.jsonp(docs);
    });
});

module.exports = router;
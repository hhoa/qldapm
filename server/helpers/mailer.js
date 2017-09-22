const nodemailer = require('nodemailer');

exports.sendMail = (email, host, token) => {
    let smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'neoreul.qn96@gmail.com',
            pass: 'hoatran84@'
        }
    });

    let mailOptions = {
        from: 'Do Not Rely <support@lct.vn>',
        to: email,
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    smtpTransport.sendMail(mailOptions, (err) => {
        if (err){
            //console.log(err.message);
            res.send(304);
        }
        else {
            res.send(200);
        }
    });
};
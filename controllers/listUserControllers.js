const listUser = require('../models/listUserModels');
const formidable = require('formidable');
const fs = require('fs');
const { dirname } = require('path');
const { ExpectationFailed } = require('http-errors');
const randomstring = require('randomstring')

require("dotenv").config();
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})
const jwt = require('jsonwebtoken')

exports.getAccountInfo = async (req, res, next) => {
    const users = await listUser.getUserByID(req.user.id);
    res.render('book-shop/account-info', users);
}
exports.updateAccountInfo = async (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const avatar = files.avatar;
        if (avatar.size > 0) {
            const name = avatar.path.split('/').pop()
            const extension = avatar.name.split('.').pop();
            fields.avatar = name + '.' + extension;
            fs.renameSync(avatar.path, __dirname + '/../public/book-shop/img/' + name + '.' + extension);
        }
        listUser.updateOneAccount(req.user.id, fields).then((result) => {
            res.redirect('/book-shop/account-info');
        });
    });
}

exports.addOneAccount = async (req, res, next) => {
    const firstName = req.body.firstName;
    console.log(firstName);
    const lastName = req.body.lastName;
    console.log(lastName);
    const avatar = req.body.avatar[0];
    const email = req.body.email;
    const numberPhone = req.body.numberPhone;
    const more = req.body.more;
    const user = listUser.addOneAccount(firstName, lastName, avatar, email, numberPhone, more);
    res.send(user);
}

exports.index = (req, res, next) => {
    res.render('index');
}

exports.login = (req, res, next) => {
    res.render('book-shop/login');
}


exports.forgotPassword = (req, res, next) => {
    res.render('book-shop/forgotPassword');
}

exports.postForgotPassword = async (req, res, next) => {
    const email = req.body.email
    const user = await listUser.findUserByEmail(email)
    if (user == null){
        showNotif(res, "Error!!!", "An account with your email does not exist!!!")    
    }

    const token = jwt.sign({email}, process.env.JWT_RESET_PASS, {expiresIn: '1m'})

    const emailData = {
        from: 'My Book Store <noreply@mybookstore.com>',
        to: email,
        subject: 'Reset your password',
        html: `
            <h2>Please click on the link below to reset your password</h2>  
            <a href="${process.env.CLIENT_URL}book-shop/resetPassword/${token}">
            ${process.env.CLIENT_URL}book-shop/resetPassword/${token}</a>
        `
    };

    transporter.sendMail(emailData, (err, info) => {
        if (err){
            console.log(err);
            showNotif(res, "Error", 'Sorry, some error happen while we try to send you reset password link!!!');
        } else {
            console.log('Email has been sent!!!');
            showNotif(res, "Reset password", 'Please check your email to take reset password link!!!');
        }
    })
}

exports.resetPassword = async (req, res) => {
    const token = req.params.token;
    if (token){
        let email;
        jwt.verify(token, process.env.JWT_RESET_PASS, function(err, decoded) {
            if (err){
                showNotif(res, "Error!!!", 'Link is expired!!!');
            } else {
                email = decoded.email
            }
          });
        const newPassword = randomstring.generate(10)
        const user = await listUser.setPassword(email, newPassword)
        if (user != null){
            showNotif(res, "Reset password successfully", "Your username is: " + user.username + " ;Your new password is: " + newPassword)
        } else {
            showNotif(res, "Error", "Sorry, something happen while we are trying to reset your password")
        }
    } else {
        showNotif(res, "Error!!!", 'Link is expired!!!');
    }
}

exports.postLogout = (req, res, next) => {
    req.logOut()
    res.redirect('/book-shop/login')
}

exports.getRegister = async (req, res, next) => {
    res.render('book-shop/register');
}

exports.postRegister = async (req, res, next) => {
    const data = req.body
    const message = await listUser.checkValidAccount(data);
    
    if (message == 'Valid account'){
        const username = data.username
        const email = data.email
        const password = data.password

        const token = jwt.sign({username, email, password}, process.env.JWT_ACC_ACTIVATE, {expiresIn: '1m'})

        const emailData = {
            from: 'My Book Store <noreply@mybookstore.com>',
            to: data.email,
            subject: 'Verify your email',
            html: `
                <h2>Please click on the link below to activate your account!</h2>  
                <a href="${process.env.CLIENT_URL}book-shop/verifyEmail/${token}">
                ${process.env.CLIENT_URL}book-shop/verifyEmail/${token}</a>
            `
        };

        transporter.sendMail(emailData, (err, info) => {
            if (err){
                console.log(err);
                showNotif(res, "Error", "Sorry, some error happen while we try to send you an email with verify link!!!");
            } else {
                console.log('Email has been sent!!!');
                showNotif(res, "Verify email", "Please check your email to take verify link!!!");
            }
        })
    } else {

        showNotif(res, "Register error!!!", message);

    }
}
exports.verifyEmail = async (req, res) => {
    const token = req.params.token;
    if (token){
        let username, email, password
        jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function(err, decoded) {
            if (err){
                showNotif(res, "Error!!!", 'Link is expired!!!');
            } else {
                username = decoded.username
                email = decoded.email
                password = decoded.password
            }
          });
        const isValid = await listUser.checkValidEmailAndUsername(email, username)
        if (isValid){
            await listUser.createAccount(username, password, email)
            showNotif(res, "Verify successfully!!!", "Your account are registered successfully!!!");
        } else {
            showNotif(res, "Verify error!!!", "Your email or username already exist!!!");
        }
    } else {
        showNotif(res, "Verify error!!!", 'Link is expired!!!');
    }
}

function showNotif(res, myNotifTitle, myNotifText) {
    res.render('book-shop/notif', {
        notifTitle: myNotifTitle,
        notifText: myNotifText
    });
}

const listUser = require('../models/listUserModels');
const formidable = require('formidable');
const fs = require('fs');
const { dirname } = require('path');
const { ExpectationFailed } = require('http-errors');

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
        listUser.updateOncAccount(req.user.id, fields).then((result) => {
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
            } else {
                console.log('Email has been sent!!!');
            }
        })

        res.render('book-shop/notif', {
            notifTitle: "Verify email",
            notifText: "Please check your email to take verify link!!!"
        })
    } else {
        res.render('book-shop/notif', {
            notifTitle: "Register error!!!",
            notifText: message
        })
    }
}
exports.verifyEmail = async (req, res) => {
    const token = req.params.token;
    if (token){
        const {username, email, password} = jwt.verify(token, process.env.JWT_ACC_ACTIVATE)
        const isValid = await listUser.checkValidEmailAndUsername(email, username)
        if (isValid){
            await listUser.createAccount(username, password, email)
            res.render('book-shop/notif', {
                notifTitle: "Verify successfully!!!",
                notifText: "Your account are registered successfully!!!"
            })
        } else {
            res.render('book-shop/notif', {
                notifTitle: "Verify error!!!",
                notifText: "Your email or username already exist!!!"
            })
        }
    } else {
        res.render('book-shop/notif', {
            notifTitle: "Verify error!!!",
            notifText: 'Link is expired!!!'
        })
    }
}
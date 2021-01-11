const listUser = require('../models/listUserModels');
const path = require('path');
const { ExpectationFailed } = require('http-errors');
const randomstring = require('randomstring')
const bcrybt = require('bcrypt')
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

require("dotenv").config();
cloudinary.config({
    cloud_name: 'dvhhz53rr',
    api_key: '272966692333936',
    api_secret: '0Tz28aal-cHCjr0K5bYF4V00XYo'
});
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
    const user = await listUser.getUserByID(req.user.id);

    //decoded avatar
    if (user.avatar) {
        user.avatar = user.avatar.toString('base64')
    }

    res.render('book-shop/account-info', {
        user,
        title: 'Account Information'
    })
}

exports.getListAccount = async (req, res, next) => {
    const users = await listUser.getListAccount()
    res.send(users);
}
exports.updateAccountInfo = async (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        let avatar = req.user.avatar;
        console.log(avatar.toString());
        if (err) {
            next(err);
            return;
        }
        if (files.avatar.size > 0) {
            const img = await cloudinary.uploader.upload(files.avatar.path);
            avatar = img.url;
        }
        const data = {
            firstName: fields.firstName,
            lastName: fields.lastName,
            phoneNumber: fields.phoneNumber,
            more: fields.more,
            avatar: avatar
        };
        const user = await listUser.updateOneAccount(req.user.id, data)

        if (user) {
            res.redirect('/book-shop/account-info')
        } else {
            showNotif(res, "Error", "Sorry, some error happen while we trying to update your account!")
        }
    });
}

exports.addOneAccount = async (req, res, next) => {
    const form = formidable({ multiples: true });

    form.parse(req, async(err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const firstName = fields.firstName;
        const lastName = fields.lastName;
        const img = await cloudinary.uploader.upload(files.avatar.path);
        const avatar = img.url;
        const email = fields.email;
        const numberPhone = fields.numberPhone;
        const more = fields.more;
        const user = listUser.addOneAccount(firstName, lastName, avatar, email, numberPhone, more);
        res.send(user);
    });

}

exports.index = (req, res, next) => {
    res.render('index', {
        title: 'Home'
    })
}

exports.login = (req, res, next) => {
    res.render('book-shop/login', {
        title: 'Login'
    })
}

exports.forgotPassword = (req, res, next) => {
    res.render('book-shop/forgotPassword', {
        title: 'Forgot Password'
    })
}

exports.postForgotPassword = async (req, res, next) => {
    const email = req.body.email
    const user = await listUser.findUserByEmail(email)
    if (user == null) {
        showNotif(res, "Error!!!", "An account with your email does not exist!!!")
    }

    const token = jwt.sign({ email }, process.env.JWT_RESET_PASS, { expiresIn: '1m' })

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
        if (err) {
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
    if (token) {
        let email;
        jwt.verify(token, process.env.JWT_RESET_PASS, function (err, decoded) {
            if (err) {
                showNotif(res, "Error!!!", 'Link is expired!!!');
            } else {
                email = decoded.email
            }
        });
        const newPassword = randomstring.generate(10)
        const user = await listUser.setPasswordByEmail(email, newPassword)
        if (user != null) {
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
    res.render('book-shop/register', {
        title: 'Register'
    })
}

exports.postRegister = async (req, res, next) => {
    const data = req.body
    const message = await listUser.checkValidAccount(data);

    if (message == 'Valid account') {
        const username = data.username
        const email = data.email
        const password = data.password
        const hashedPassword = await bcrybt.hash(password[0], 10);

        const token = jwt.sign({ username, email, hashedPassword }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '1m' })
        console.log(data.email);
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
            if (err) {
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
    if (token) {
        let username, email, hashedPassword
        jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function (err, decoded) {
            if (err) {
                showNotif(res, "Error!!!", 'Link is expired!!!');
            } else {
                username = decoded.username
                email = decoded.email
                hashedPassword = decoded.hashedPassword
            }
        });
        const isValid = await listUser.checkValidEmailAndUsername(email, username)
        if (isValid) {
            await listUser.createAccount(username, hashedPassword, email)
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
        notifText: myNotifText,
        title: 'Alert'
    });
}

exports.changePassword = (req, res) => {
    res.render('book-shop/changePassword', {
        title: "Change password"
    })
}
exports.postChangePassword = async (req, res) => {
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const isValid = await bcrybt.compare(password, req.user.password)
    if (!isValid) {
        showNotif(res, "Error", "Your password is incorrect!!!")
    }
    if (newPassword[0] !== newPassword[1]) {
        showNotif(res, "Error", "Your new password and retype does not match!!!")
    }
    const user = await listUser.setPasswordByUsername(req.user.username, newPassword[0])
    if (user != null) {
        showNotif(res, "Successfully", "Your password is changed!!!")
    } else {
        showNotif(res, "Error", "Sorry, something happened while we are trying to change your password!!!")
    }
}
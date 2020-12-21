const listUser = require('../models/listUserModels');
const formidable = require('formidable');
const fs = require('fs');
const { dirname } = require('path');
const { ExpectationFailed } = require('http-errors');
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
exports.postLogout = (req, res, next) => {
    req.logOut()
    res.redirect('/book-shop/login')
}

exports.getRegister = async (req, res, next) => {
    res.render('book-shop/register');
}

exports.postRegister = async (req, res, next) => {
    const data = req.body
    const message = await listUser.createAccount(data);
    console.log(message)
    res.send(message)
}
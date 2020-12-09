const listUser = require('../models/listUserModels');
const formidable = require('formidable');
const fs = require('fs');
const { dirname } = require('path');
exports.getAccountInfo = async (req, res, next) => {
    const users = await listUser.getListAccount();
    res.render('book-shop/account-info', users[0]);
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
            fields.avatar =  name + '.' + extension;
            fs.renameSync(avatar.path, __dirname + '/../public/book-shop/img/' + name + '.' + extension);
        }
        listUser.updateOncAccount('5fcf583b6e22188a3952ec00', fields).then((result) => {
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
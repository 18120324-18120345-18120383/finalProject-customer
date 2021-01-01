const books = require('../models/listBookModels')
const users = require('../models/listUserModels')
const comments = require('../models/commnetModels');
const bcrypt = require('bcrypt')

exports.authenPassword = async (req, res, next) => {
    const isValidPass = await bcrypt.compare(req.query.password, req.user.password)
    res.send(isValidPass)
}

exports.productsListing = async (req, res, next) => {
    const page = req.query.page || 1;
    // console.log('page: ', page);
    let filter = {};
    const paginate = await books.listBook(filter, 0, page, 9);
    // console.log('data ', paginate);
    res.json(paginate)
}

exports.productDetail = async (req, res, next) => {
    const page = req.query.page || 1;
    const id = req.query.id;
    const listComment = await comments.listComment(id, page, 5);
    res.json(listComment);
}   
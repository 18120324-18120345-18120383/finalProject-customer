// const Book = require('../models/listBook');

exports.index = (req, res, next) => {
    res.render('index');
}

exports.contact = (req, res, next) => {
    res.render('book-shop/contact');
}

exports.productDetail = (req, res, next) => {
    res.render('book-shop/product-detail');
}

exports.productListing = (req, res, next) => {
    res.render('book-shop/product-listing');
}

exports.shopCart = (req, res, next) => {
    res.render('book-shop/shop-cart');
}
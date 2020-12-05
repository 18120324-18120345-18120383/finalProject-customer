const bookModels = require('../models/listBookModels');

exports.index = (req, res, next) => {
    res.render('index');
}

exports.contact = (req, res, next) => {
    res.render('book-shop/contact');
}

exports.productDetail = async (req, res, next) => {
    const id = req.params.id;
    const book = await bookModels.getOneBook(id);
    res.render('book-shop/product-detail', {book, orginalPrice: book.basePrice * 2});
}

exports.productListing = async (req, res, next) => {
    const books = await bookModels.listBook()
    res.render('book-shop/product-listing', {books})
}

exports.shopCart = (req, res, next) => {
    res.render('book-shop/shop-cart');
}

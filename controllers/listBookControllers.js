const mongoose = require('mongoose')

const bookModels = require('../models/listBookModels');
const categoryModels = require('../models/categoriesModels');

exports.index = (req, res, next) => {
    res.render('index');
}

exports.contact = async (req, res, next) => {
    // const books = await bookModels.addManyBook();
    // console.log('add');
    res.render('book-shop/contact');
}

exports.productDetail = async (req, res, next) => {
    const id = req.params.id;
    const book = await bookModels.getOneBook(id);
    res.render('book-shop/product-detail', {book, orginalPrice: book.basePrice * 2});
}

exports.productListing = async (req, res, next) => {
    const page = req.query.page || 1
    const categoryID = req.query.categoryID;
    const nameBook = req.query.search;
    let flag = false;
    console.log(nameBook);
    let filter = {};
    if (categoryID) {
        filter.categoryID = mongoose.Types.ObjectId(categoryID);
        flag = true;
    }
    if (nameBook) {
        filter.name = { "$regex": nameBook, "$options": "i" };
        flag = true;
    }
    const paginate = await bookModels.listBook(filter, page, 9);
    const categories = await categoryModels.categories();
    res.render('book-shop/product-listing', {
        books: paginate.docs,
        page: paginate.page,
        nextPage: paginate.nextPage,
        prevPage: paginate.prevPage,
        hasNextPage: paginate.hasNextPage,
        hasPrevPage: paginate.hasPrevPage,
        limit: paginate.limit,
        total: paginate.totalPages,
        categories,
        flag,
        nameBook,
        categoryID 
    });
}

exports.shopCart = (req, res, next) => {
    res.render('book-shop/shop-cart');
}

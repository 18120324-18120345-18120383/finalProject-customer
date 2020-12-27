const mongoose = require('mongoose')
const bookModels = require('../models/listBookModels');
const categoryModels = require('../models/categoriesModels');
const shopCartMoels = require('../models/shopCartModels')
const buildUrl = require('build-url');

exports.index = async (req, res, next) => {
    res.render('index', {
        title: 'Home'
    })
}
exports.contact = async (req, res, next) => {
    res.render('book-shop/contact', {
        title: 'Contact'
    })
}

exports.productDetail = async (req, res, next) => {
    const id = req.params.id;
    const book = await bookModels.getOneBook(id);
    res.render('book-shop/product-detail', {
        book, orginalPrice: book.basePrice * 2,
        title: 'Product detail'
    });
}

exports.productListing = async (req, res, next) => {
    const page = req.query.page || 1
    const categoryID = req.query.categoryID;
    
    const nameBook = req.query.search;
    const maxPrice = req.query.maxPrice;
    const minPrice = req.query.minPrice;
    console.log(minPrice);
    console.log(maxPrice);
    console.log(req.originalUrl)
    let url = buildUrl('/book-shop/product-listing', {
        
    });
    let haveSearch = false;
    // console.log(nameBook);
    let filter = {};
    if (categoryID) {
        filter.categoryID = mongoose.Types.ObjectId(categoryID);
        url = buildUrl('/book-shop/product-listing', {
            queryParams: {
                search: nameBook,
                categoryID: categoryID
            }
        });
        flag = true;
    }
    if (nameBook) {
        filter.name = { "$regex": nameBook, "$options": "i" };
        console.log(filter.name)
        url = buildUrl('/book-shop/product-listing', {
            queryParams: {
                search: nameBook,
                categoryID: categoryID
            }
        });
        haveSearch = true;
    }
    if (minPrice && maxPrice) {
        filter.basePrice = { $gt: minPrice, $lt: maxPrice }
    }
    const paginate = await bookModels.listBook(filter, page, 9);
    const categories = await categoryModels.categories();
    
    const currentPageURL = buildUrl('/book-shop/product-listing', {
        queryParams: {
            search: nameBook,
            categoryID: categoryID,
            minPrice: minPrice,
            maxPrice: maxPrice,
            page: paginate.page
        }
    });
    const prevPageURL = buildUrl('/book-shop/product-listing', {
        queryParams: {
            search: nameBook,
            categoryID: categoryID,
            minPrice: minPrice,
            maxPrice: maxPrice,
            page: paginate.prevPage
        }
    });
    const nextPageURL = buildUrl('/book-shop/product-listing', {
        queryParams: {
            search: nameBook,
            categoryID: categoryID,
            minPrice: minPrice,
            maxPrice: maxPrice,
            page: paginate.nextPage
        }
    });
    const newURL = [prevPageURL, currentPageURL, nextPageURL]
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
        haveSearch,
        newURL,
        title: 'Product list'
    });
}

exports.shopCart = (req, res, next) => {
    res.render('book-shop/shop-cart', {
        title: 'Shop Cart'
    })
}

const books = require('../models/listBookModels')
const users = require('../models/listUserModels')
const comments = require('../models/commnetModels');
const shopCart = require('../models/shopCartModels');
const countries = require('../models/countryModels');
const bcrypt = require('bcrypt')

const cartID = '5fffefcff8c11d2b848a17b4' // cartID cho nguoi dung khong dang nhap

exports.authenPassword = async (req, res, next) => {
    const isValidPass = await bcrypt.compare(req.query.password, req.user.password)
    res.send(isValidPass)
}

exports.changeQuantity = async (req, res, next) => {
    const productID = req.query.productID;
    const quantity = req.query.value;
    let result;
    if (req.user) {
        result = await shopCart.changeQuantity(req.user.cartID, productID, quantity);
    } else {
        result = await shopCart.changeQuantity(cartID, productID, quantity);
    }   
    
    res.json(result);
}
exports.productsListing = async (req, res, next) => {
    const page = req.query.page || 1
    const categoryID = req.query.categoryID;
    // console.log("categoryID" + categoryID)
    const nameBook = req.query.search;
    const maxPrice = req.query.maxPrice;
    const minPrice = req.query.minPrice;
    const sort = req.query.sort;
    // console.log(categoryID);
    let filter = {};
    if (categoryID) {
        filter.categoryID = categoryID;
    }
    if (nameBook) {
        filter.name = { "$regex": nameBook, "$options": "i" };
    }
    if (minPrice >= 0 && maxPrice >= 0) {
        filter.basePrice = { $gt: minPrice, $lt: maxPrice }
    }
    const paginate = await books.listBook(filter, sort, page, 9);
    // console.log('data ', paginate);
    res.json(paginate)
}

exports.productDetail = async (req, res, next) => {
    const page = req.query.page || 1;
    const id = req.query.id;
    const listComment = await comments.listComment(id, page, 5);
    res.json(listComment);
}

exports.addComment = async (req, res, next) => {
    const page = 1;
    const data = { name: req.query.name, content: req.query.content, rating: req.query.rating, productID: req.query.productID };
    const id = req.query.productID;
    await comments.addCommnet(data, req.user);
    const listComment = await comments.listComment(id, page, 5);
    res.json(listComment);
}
exports.addOneItem = async (req, res, next) => {
    const bookID = req.query.id;
    const quantity = req.query.qty || 1;
    // console.log('quantity: ' + quantity);
    if (req.user) {
        let myCart;
        if (!req.user.cartID) {
            const cart = await shopCart.initCart()
            await listUser.addCartID(req.user._id, cart._id)
        }
        const userCartID = req.user.cartID
        const cart = await shopCart.cart(userCartID);
        if (cart) {
            await shopCart.addOneItem(userCartID, bookID, quantity);
            req.cart = cart;
            myCart = await shopCart.cart(userCartID);
        }
        else {
            const cart = await shopCart.initCart();
            await listUser.addCartID(req.user._id, cart._id)
            const userCartID = req.user.cartID
            await shopCart.addOneItem(userCartID, bookID, quantity)
            req.cart = cart;
            myCart = await shopCart.cart(userCartID);
        }
        myCart = await shopCart.cart(userCartID);
        req.cart = myCart;
        res.json(myCart);
    }
    else {
        const cart = await shopCart.cart(cartID);
        let myCart;
        if (cart) {
            console.log("Adding");
            myCart = await shopCart.addOneItem(cartID, bookID, quantity);
            console.log("Added");
        }
        req.cart = myCart;
        res.json(myCart);
    }
}

exports.deleteCartItem = async (req, res, next) => {
    let myCart
    if (req.user) {
        const userCartID = req.user.cartID
        myCart = await shopCart.deleteItem(userCartID, req.query.id);
        console.log(req.cart);
        req.cart = myCart;
        res.json(myCart);
    } else {
        myCart = await shopCart.deleteItem(cartID, req.query.id);
        console.log(req.cart);
        req.cart = myCart;
        console.log(req.cart);
        res.json(myCart);
    }
}
exports.getDistricts = async (req, res, next) => {
    const province = req.query.province;
    const districts = await countries.district(province);
    res.json(districts);
}

exports.getWards = async (req, res, next) => {
    const province = req.query.province;
    const district = req.query.district;
    const wards = await countries.wards(province, district);
    res.json(wards);
}

exports.checkExistUsername = async (req, res, next) => {
    const username = req.query.username;
    const user = await users.findUserByUsername(username)
    if (user) {
        res.send(true);
    } else {
        res.send(false);
    }
}
exports.checkExistEmail = async (req, res, next) => {
    const email = req.query.email;
    const user = await users.findUserByEmail(email)
    if (user) {
        res.send(true);
    } else {
        res.send(false);
    }
}
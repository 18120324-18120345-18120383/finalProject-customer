const books = require('../models/listBookModels')
const users = require('../models/listUserModels')
const comments = require('../models/commnetModels');
const shopCart = require('../models/shopCartModels');
const countries = require('../models/countryModels');
const bcrypt = require('bcrypt')

const cartID = '5ff277c26dd1e0231ca9bc69' // cartID cho nguoi dung khong dang nhap

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

exports.addOneItem = async (req, res, next) => {
    const bookID = req.query.id;
    const quantity = req.query.qty || 1;
    console.log('quantity: ' + quantity);
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
            const x = await shopCart.addOneItem(cartID, bookID, quantity);
            console.log("Added");
            myCart = await shopCart.cart(cartID);
            
        }
        myCart = await shopCart.cart(cartID);
        req.cart = myCart;
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
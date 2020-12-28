const { authenticateUser } = require('../models/listUserModels');
const listUser = require('../models/listUserModels');
const shopCart = require('../models/shopCartModels')

const cartID = '5fe453a22329a4349fda3be2' // cartID cho nguoi dung khong dang nhap
module.exports.checkOut = async (req, res, next) => {
  if (req.user) {
    const userCartID = req.user.cartID
    await shopCart.payShopCart(userCartID)
    res.redirect('shop-cart')
  }
}
module.exports.addItem = async (req, res, next) => {
  const bookID = req.body.id;
  const quantity = req.body.qty || 1
  ; /// Van con bug o day
  console.log('quantity: ' + quantity);
  if (req.user) {
    if (!req.user.cartID) {
      const cart = await shopCart.initCart()
      await listUser.addCartID(req.user._id, cart._id)
    }
    const userCartID = req.user.cartID
    const item = await shopCart.cart(userCartID);
    if (item) {
      await shopCart.addOneItem(userCartID, bookID, quantity);
      req.cart = cart;
    }
    else {
      const cart = await shopCart.initCart();
      await listUser.addCartID(req.user._id, cart._id)
      const userCartID = req.user.cartID
      await shopCart.addOneItem(userCartID, bookID, quantity)
      req.cart = cart;
    }
  }
  else {
    const cart = await shopCart.cart(cartID);
    req.cart = cart;
    if (cart) {
      await shopCart.addOneItem(cartID, bookID, quantity);
    }
  }
  
  res.redirect('product-listing');
}
module.exports.deleteItem = async (req, res, next) => {
  if (req.user) {
    const userCartID = req.user.cartID
    await shopCart.deleteItem(userCartID, req.query.id);
    res.redirect('shop-cart');
  } else {
    await shopCart.deleteItem(cartID, req.query.id);
    res.redirect('shop-cart');
  }
}
module.exports.listItem = async (req, res, next) => {
  if (req.user) {
    const userCartID = req.user.cartID
    const cart = await shopCart.cart(userCartID);
    if (cart) {
      res.render('book-shop/shop-cart', { listItem: cart.products, total: cart.total });
    }
    else {
      res.render('book-shop/shop-cart')
    }
  } else {
    const cart = await shopCart.cart(cartID);
    if (cart) {
      res.render('book-shop/shop-cart', { listItem: cart.products, total: cart.total });
    }
    else {
      res.render('book-shop/shop-cart')
    }
  }

}
module.exports.updateQuantity = async (req, res, next) => {
  const listQuantity = req.body.quantity;
  const listID = req.body.newID;
  if (req.user) {
    const userCartID = req.user.cartID;
    await shopCart.updateQuantity(userCartID, listQuantity, listID);
    res.redirect('shop-cart');
  } else {
    await shopCart.updateQuantity(cartID, listQuantity, listID);
    res.redirect('shop-cart');
  }
}
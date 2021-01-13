const { authenticateUser } = require('../models/listUserModels');
const listUser = require('../models/listUserModels');
const shopCart = require('../models/shopCartModels')
const countries = require('../models/countryModels');

const cartID = '5ff277c26dd1e0231ca9bc69';
module.exports.checkOut = async (req, res, next) => {
  if (req.user) {
    const userCartID = req.user.cartID;
    const userID = req.user._id;
    const address = req.body.fullAddress
    await shopCart.payShopCart(userCartID, userID, address);
    res.redirect('/book-shop/shop-cart');
  }
}
module.exports.addItem = async (req, res, next) => {
  const bookID = req.body.id;
  const quantity = req.body.qty || 1; /// Van con bug o day
  console.log('quantity: ' + quantity);
  if (req.user) {
    if (!req.user.cartID) {
      const cart = await shopCart.initCart()
      await listUser.addCartID(req.user._id, cart._id)
    }
    const userCartID = req.user.cartID
    const cart = await shopCart.cart(userCartID);
    if (cart) {
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
    res.redirect('/book-shop/shop-cart');
  } else {
    await shopCart.deleteItem(cartID, req.query.id);
    res.redirect('/book-shop/shop-cart');
  }
}
module.exports.listItem = async (req, res, next) => {
  const province = await countries.province();
  if (req.user) {
    const userCartID = req.user.cartID
    const cart = await shopCart.cart(userCartID);
    // console.log(province)
    if (cart) {
      res.render('book-shop/shop-cart', {
        listItem: cart.products,
        total: cart.total, 
        province,
        title: "Shop cart"
      });
    }
    else {
      res.render('book-shop/shop-cart', {
        title: "Shop cart"
      })
    }
  } else {
    const cart = await shopCart.cart(cartID);
    if (cart) {
      res.render('book-shop/shop-cart', {
        listItem: cart.products, 
        total: cart.total,
        title: "Shop cart"
      });
    }
    else {
      res.render('book-shop/shop-cart', {
        title: "Shop cart"
      })
    }
  }
}
module.exports.updateQuantity = async (req, res, next) => {
  const listQuantity = req.body.quantity;
  const listID = req.body.newID;
  if (req.user) {
    const userCartID = req.user.cartID;
    await shopCart.updateQuantity(userCartID, listQuantity, listID);
    res.redirect('/book-shop/shop-cart');
  } else {
    await shopCart.updateQuantity(cartID, listQuantity, listID);
    res.redirect('/book-shop/shop-cart');
  }
}

module.exports.myOrder = async (req, res, next) => {
  if (req.user) {
    const listProduct = await shopCart.listProductOrdered(req.user._id);
    if (listProduct) {
      res.render('book-shop/my-order', {listProduct});
    } else {
      res.render('book-shop/my-order');
    }
  }
}

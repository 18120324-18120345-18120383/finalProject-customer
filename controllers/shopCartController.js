const shopCart = require('../models/shopCartModels')

module.exports.addItem = async(req, res, next) => {
  const bookID = req.body.id;
  const quantity = req.body.qty1 || 1;
  const cartID = '5fe3e937fc4c1719b1fe98d2'
  const item = await shopCart.addOneItem(cartID, bookID, quantity);
  res.redirect('shop-cart');
}
module.exports.deleteItem = async(req, res, next) => {
  console.log(req.query);
  const cartID = '5fe3e937fc4c1719b1fe98d2';
  await shopCart.deleteItem(cartID, req.query.id);
  res.redirect('shop-cart');
}
module.exports.listItem = async(req, res, next) => {
  const cartID = '5fe3e937fc4c1719b1fe98d2';
  const cart = await shopCart.listProduct(cartID);
  // console.log(cart.products);
  res.render('book-shop/shop-cart', {listItem: cart});
}
module.exports.updateQuantity = async(req, res, next) => {
  const listQuantity = req.body.quantity;
  const listID = req.body.newID;
  console.log(listID);
  console.log(listQuantity);
  const cartID = '5fe3e937fc4c1719b1fe98d2';
  await shopCart.updateQuantity(cartID, listQuantity, listID);
  res.redirect('shop-cart');
}
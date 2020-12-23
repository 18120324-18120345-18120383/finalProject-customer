const shopCart = require('../models/shopCartModels')

module.exports.addItem = async(req, res, next) => {
  console.log("here")
  const bookID = req.body.id;
  const quantity = req.body.qty1 || 1;
  console.log(quantity)
  const cartID = '5fe3813d0c1ede8dc68149eb'
  const item = await shopCart.addOneItem(cartID, bookID, quantity);
  res.redirect('shop-cart')
}
module.exports.deleteItem = async(req, res, next) => {
  console.log(req.query);
  await shopCart.deleteItem(req.query.id);
  res.redirect('shop-cart')
}
module.exports.listItem = async(req, res, next) => {
  const cartID = '5fe3813d0c1ede8dc68149eb'
  const cart = await shopCart.listProduct(cartID);
  console.log(cart.products);
  res.render('book-shop/shop-cart', {listItem: cart.products});
}
module.exports.updateQuantity = async(req, res, next) => {
  const listQuantity = req.body.quantity;
  const listID = req.body.newID;
  await shopCart.updateQuantity(listQuantity, listID);
  const listItem = await shopCart.listProduct();
  res.redirect('shop-cart');
}
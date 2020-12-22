const shopCart = require('../models/shopCartModels')

module.exports.addItem = async(req, res, next) => {
  console.log("here")
  const id = req.body.id;
  console.log(id);
  const quantity = req.body.qty1 || 1;
  console.log(quantity)
  const item = await shopCart.addOneItem(id, quantity);
  res.redirect('shop-cart')
}
module.exports.deleteItem = async(req, res, next) => {
  await shopCart.deleteItem(req.body.id)
  res.redirect('shop-cart')
}
module.exports.listItem = async(req, res, next) => {
  const listItem = await shopCart.listProduct();
  console.log(listItem);
  res.render('book-shop/shop-cart', {listItem});
}
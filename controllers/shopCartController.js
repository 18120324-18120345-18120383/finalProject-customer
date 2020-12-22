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
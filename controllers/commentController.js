const commnetModel = require('../models/commnetModels');

exports.addCommnet = async(req, res, next) => {
  const data = req.body;
  const user = req.user;
  await commnetModel.addCommnet(data, user);
  res.redirect('/book-shop/product-detail/' + data.productID);
}
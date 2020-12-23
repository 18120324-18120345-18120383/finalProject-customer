const mongoose = require('mongoose');
const { shopCart } = require('../controllers/listBookControllers');
const { ObjectID } = require('mongodb');
const listBookModel = require('./listBookModels');
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
  cover: String,
  description: String
})

const cartSchema = new mongoose.Schema({
  products: [productSchema]
})
const ShopCart = mongoose.model('carts', cartSchema);

module.exports.addOneItem = async(cartID, productID, quantity) => {
  const book = await listBookModel.getOneBook(productID)
  console.log(book)
  // let olditem = await ShopCart.products[0].findOne({name: book.name});
  // let item;
  // if (olditem) {
  //   item = await ShopCart.products[0].findOneAndUpdate({name: book.name}, {quantity: olditem.quantity + 1, total: olditem.price * (olditem.quantity + 1)})
  // }
  const cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID));

  cart.products.push({
    name : book.name ,
    price : book.basePrice,
    quantity : Number(quantity),
    total : book.basePrice * Number(quantity),
    cover : book.cover[0],
    description : book.description
  });
  await cart.save();
  console.log(cart);
  return cart;
}

module.exports.deleteItem = async (id) => {
  await ShopCart.findByIdAndDelete({_id: id})
}
module.exports.listProduct = async (cartID) => {
  const cart = await ShopCart.findById(cartID);
  return cart;
}
module.exports.updateQuantity = async (listQuantity, listID) => {
  let count = 0;
  if (listQuantity && listID) {
    count = listQuantity.length;
  }
  let i = 0
  for(i = 0; i < count; i++) {
    const item = await ShopCart.findById(listID[i]);
    await ShopCart.findByIdAndUpdate(listID[i], {quantity: listQuantity[i], total: listQuantity[i] * item.price})
  }
  return true;
}
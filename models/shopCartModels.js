const mongoose = require('mongoose');
const { shopCart } = require('../controllers/listBookControllers');
const listBookModel = require('./listBookModels');
const cardSchema = mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
  cover: String,
  description: String
})

const ShopCart = mongoose.model('shop-carts', cardSchema);

module.exports.addOneItem = async(id, quantity) => {
  console.log(id);
  const book = await listBookModel.getOneBook(id)
  console.log(book)
  let olditem = await ShopCart.findOne({name: book.name});
  let item = await ShopCart.findOneAndUpdate({name: book.name}, {quantity: olditem.quantity + 1})
  if (!item) {
    item = await ShopCart.create({
      name : book.name ,
      price : book.price,
      quantity : Number(quantity),
      total : book.basePrice * Number(quantity),
      cover : book.cover[0],
      description : book.description
    });
  }
  return item;
}
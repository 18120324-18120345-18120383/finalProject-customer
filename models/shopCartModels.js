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
  let item;
  if (olditem) {
    item = await ShopCart.findOneAndUpdate({name: book.name}, {quantity: olditem.quantity + 1, total: olditem.price * (olditem.quantity + 1)})
  }
  
  if (!item) {
    item = await ShopCart.create({
      name : book.name ,
      price : book.basePrice,
      quantity : Number(quantity),
      total : book.basePrice * Number(quantity),
      cover : book.cover[0],
      description : book.description
    });
  }
  return item;
}

module.exports.deleteItem = async (id) => {
  console.log(id);
  await ShopCart.findByIdAndDelete({_id: id})
}
module.exports.listProduct = async () => {
  const listItem = await ShopCart.find({});
  return listItem;
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
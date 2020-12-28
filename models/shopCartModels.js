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
  status: Number,
  total: Number,
  orderDay: Date,
  products: [productSchema]
})
const ShopCart = mongoose.model('carts', cartSchema);

module.exports.initCart = async () => {
  const cart = new ShopCart({
    status: 0,
    total: 0
  })
  cart.save();
  return cart;
}
module.exports.addOneItem = async (cartID, productID, quantity) => {
  const book = await listBookModel.getOneBook(productID)
  let cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID));
  if (cart && cart.status == 0) {
    const products = cart.products;
    const index = products.findIndex(x => x.name == book.name)
    console.log(index);
    let totalPriceItem = 0;
    if (index >= 0) {
      products[index].quantity += quantity;
      products[index].total = products[index].quantity * products[index].price
      totalPriceItem = book.basePrice * Number(quantity)
    }
    else {
      cart.products.push({
        name: book.name,
        price: book.basePrice,
        quantity: Number(quantity),
        total: book.basePrice * Number(quantity),
        cover: book.cover[0],
        description: book.description
      });
      totalPriceItem = book.basePrice * Number(quantity)
    }
    cart.total += totalPriceItem;
    cart.save();
  }
  else {
    return false;
  }
  return cart;
}

module.exports.deleteItem = async (cartID, productID) => {
  const cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID));
  let totalPriceItem = 0;
  if (cart) {
    const products = cart.products;
    const index = products.findIndex(x => x._id == productID)
    if (index >= 0) {
      totalPriceItem = products[index].total;
      products.splice(index, 1);
    }
  }
  cart.total -= totalPriceItem;
  cart.save();
}
module.exports.cart = async (cartID) => {
  // console.log('Cart ID: ' + cartID);
  // await ShopCart.updateMany({}, {total: 0});
  const cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID)).exec();
  if (cart) {
    // console.log('product: ' + cart.products);
  }
  else {
    console.log('Not exists');
    return false;
  }
  if (cart.status == 1) {
    return false;
  }
  return cart;
}
module.exports.updateQuantity = async (cartID, listQuantity, listID) => {
  console.log('Cart ID: ' + cartID);
  const cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID)).exec();
  if (cart) {
    console.log(cart.products);
  }
  else {
    console.log('Not exists');
  }
  const products = cart.products;
  let count = 0;
  if (listQuantity.length > 1 && listID.length > 1) { // Trường hợp vỏ hàng có 1 sản phẩm 
    count = listQuantity.length;
  }
  else {
    if (cart) {
      const index = products.findIndex(x => x._id == listID)
      let totalPriceItem = 0
      console.log(index);
      if (index >= 0) {
        products[index].quantity = listQuantity;
        products[index].total = products[index].quantity * products[index].price
        totalPriceItem = products[index].total
      }
    }
    cart.total = totalPriceItem
    cart.save();
    return true;
  }
  // Trường hợp vỏ hàng có nhiều sản phẩm 
  let i = 0
  if (cart) {
    let totalPriceItem = 0;
    for (i = 0; i < count; i++) {
      const index = products.findIndex(x => x._id == listID[i])
      if (index >= 0) {
        products[index].quantity = listQuantity[i];
        products[index].total = products[index].quantity * products[index].price
        totalPriceItem += products[index].total;
      }
    }
    cart.total = totalPriceItem;
  }
  cart.save();
  return true;
}

module.exports.payShopCart = async (cartID) => {
  console.log()
  await ShopCart.findByIdAndUpdate(cartID, { status: 1, orderDay: Date() });
}
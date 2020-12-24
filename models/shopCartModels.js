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
  let cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID));
  if (cart) {
    const products = cart.products;
    const index = products.findIndex(x => x.name == book.name)
    console.log(index);
    if (index >= 0) {
      products[index].quantity += 1;
      products[index].total = products[index].quantity * products[index].price
    }
    else {
      cart.products.push({
        name : book.name ,
        price : book.basePrice,
        quantity : Number(quantity),
        total : book.basePrice * Number(quantity),
        cover : book.cover[0],
        description : book.description
      });
    }    
    cart.save();
  }
  else {
    cart = new ShopCart({
      products: {
        name : book.name ,
        price : book.basePrice,
        quantity : Number(quantity),
        total : book.basePrice * Number(quantity),
        cover : book.cover[0],
        description : book.description
      }
    })
    cart.save();
  }
  return cart;
}

module.exports.deleteItem = async (cartID, productID) => {
  const cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID));
  if (cart) {
    const products = cart.products;
    const index = products.findIndex(x => x._id == productID)
    console.log(index);
    if (index >= 0) {
      products.splice(index, 1);
    }
  }
  cart.save();
}
module.exports.listProduct = async (cartID) => {
  // console.log('Cart ID: ' + cartID);
  const cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID)).exec();
  if (cart) {
    // console.log(cart.products);
  }
  else {
    console.log('Not exists');
  }
  return cart.products;
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
  if (listQuantity.length > 1 && listID.length > 1) {
    count = listQuantity.length;
  }
  else {
    if (cart) {
      const index = products.findIndex(x => x._id == listID)
      console.log(index);
      if (index >= 0) {
        products[index].quantity = listQuantity;
        products[index].total = products[index].quantity * products[index].price
      }
    }
    cart.save();
    return true;
  }
  let i = 0
  if (cart) {
    for(i = 0; i < count; i++) {
      const index = products.findIndex(x => x._id == listID[i])
      console.log(index);
      if (index >= 0) {
        products[index].quantity = listQuantity[i];
        products[index].total = products[index].quantity * products[index].price
      }
    }
  }
  cart.save();
  return true;
}
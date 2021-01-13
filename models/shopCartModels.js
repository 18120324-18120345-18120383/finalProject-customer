const mongoose = require('mongoose');
const { shopCart } = require('../controllers/listBookControllers');
const { ObjectID } = require('mongodb');
const listBookModel = require('./listBookModels');
const listUserModel = require('./listUserModels');

const productSchema = new mongoose.Schema({
  productID: String,
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
  coversString: String,
  description: String
})

const cartSchema = new mongoose.Schema({
  status: Number,
  total: Number,
  orderDate: Date,
  quantity: Number,
  fullAddress: String,
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
module.exports.changeQuantity = async (cartID, productID, newQuantity) => {
  const cart = await ShopCart.findById(cartID);
  const products = cart.products;
  // console.log('product: ', products);
  console.log('id: ', productID)
  const index = products.findIndex(x => x._id.toString() == productID);
  console.log('index: ', index);
  let sumPrice = 0;
  let subTotal = 0;
  console.time("hihi");
  if (index >= 0) {
    const oldQuantity = products[index].quantity;
    products[index].quantity = newQuantity;
    products[index].total = products[index].price * newQuantity;
    cart.total += (Number(newQuantity) - oldQuantity) * products[index].price;
    console.log(oldQuantity, 'jjooo', newQuantity);
    sumPrice = products[index].total;
    subTotal = cart.total;
  }
  cart.save();
  console.timeEnd("hihi");
  return { sumPrice, subTotal };
}
module.exports.addOneItem = async (cartID, productID, quantity) => {
  const book = await listBookModel.getOneBook(productID)
  if (!book) {
    return false;
  }
  let cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID));
  if (cart && cart.status == 0) {
    const products = cart.products;
    const index = products.findIndex(x => x.name == book.name)
    let totalPriceItem = 0;
    if (index >= 0) {
      products[index].quantity += Number(quantity);
      products[index].total = products[index].quantity * products[index].price
      totalPriceItem = book.basePrice * Number(quantity)
    }
    else {
      cart.products.push({
        productID: productID,
        name: book.name,
        price: book.basePrice,
        quantity: Number(quantity),
        total: book.basePrice * Number(quantity),
        coversString: book.coversString[0],
        description: book.description
      });
      totalPriceItem = book.basePrice * Number(quantity);
      if (!cart.quantity) {
        cart.quantity = 1;
      }
      else {
        cart.quantity += 1;
      }
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
  if (!cart) return false;
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
  cart.quantity -= 1;
  console.log('deleted');
  cart.save();
  return cart;
}
module.exports.cart = async (cartID) => {
  const cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID)).exec();
  if (cart) {
    // console.log('product: ' + cart.products);
  }
  else {
    console.log('Not exists');
    return false;
  }
  if (cart.status != 0) {
    return false;
  }
  return cart;
}
module.exports.updateQuantity = async (cartID, listQuantity, listID) => {
  console.log('Cart ID: ' + cartID);
  const cart = await ShopCart.findById(mongoose.Types.ObjectId(cartID)).exec();
  if (cart) {
    // console.log(cart.products);
  }
  else {
    console.log('Not exists');
    return false;
  }
  const products = cart.products;
  let count = 0;
  if (!listQuantity || !listID) {
    return false;
  }
  if (listQuantity.length > 1 && listID.length > 1) { // Trường hợp vỏ hàng có 1 sản phẩm 
    count = listQuantity.length;
  }
  else {
    let totalPriceItem = 0
    if (cart) {
      const index = products.findIndex(x => x._id == listID)
      console.log(index);
      if (index >= 0) {
        products[index].quantity = listQuantity;
        products[index].total = products[index].quantity * products[index].price
        totalPriceItem = products[index].total
      }
    }
    cart.quantity = cart.products.length;
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
    cart.quantity = cart.products.length;
    cart.total = totalPriceItem;
  }
  await cart.save();
  return true;
}

module.exports.payShopCart = async (cartID, userID, address) => {
  let dateObj = new Date();
  // await ShopCart.findByIdAndUpdate(cartID, { status: 1, orderDate: dateObj, fullAddress: address });
  let cart = await ShopCart.findById(cartID);
  cart.status = 1;
  cart.orderDate = dateObj;
  cart.fullAddress = address;
  for (let product of cart.products) {
    listBookModel.addBuyCount(product.productID);
  }
  await listUserModel.addOrderID(userID, cartID);
  await cart.save();
}

module.exports.listProductOrdered = async (userID) => {
  const user = await listUserModel.getUserByID(userID);
  const listOrderd = user.orderID;
  if (listOrderd) {
    let listProduct = [];
    for (let index = 0; index < listOrderd.length; index++) {
      const cart = await ShopCart.findById(listOrderd[index]);
      if (cart) {
        const productInCart = cart.products;
        for (let index = 0; index < productInCart.length; index++) {
          let delivering = false;
          let complete = false;
          if (cart.status == 1) {
            delivering = true;
          }
          else if (cart.status == 2) {
            complete = true;
          }
          let product = {
            checkOutDay: cart.orderDate, name: productInCart[index].name, total: productInCart[index].total,
            delivering: delivering, complete: complete, coversString: productInCart[index].coversString,
            _id: productInCart[index]._id
          };
          listProduct.push(product);
        }
      }
    }
    // console.log(listProduct);
    return listProduct;
  }
  return false;
}

module.exports.recommendBooks = async (productID) => {
  let listCartID = [];
  const listProductOrderd = await ShopCart.find({ status: { $ne: 0 } });
  for (let value of listProductOrderd) {
    for (let item of value.products) {
      if (productID == item.productID) {
        listCartID.push(value._id);
        break;
      }
    }
  }
  let listBook = [];
  let listNameBook = [];
  for (let id of listCartID) {
    const cart = await ShopCart.findById(id);
    for (let item of cart.products) {
      if (listNameBook.includes(item.name)) {
        console.log("same!");
      }
      else {
        listBook.push(item);
        listNameBook.push(item.name);
      }
      if (listBook.length > 10) break;
    }
    if (listBook.length > 10) break;
  }
  return listBook;
}
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport')
const session = require("express-session")
const flash = require("express-flash")
const bodyParser = require("body-parser");

const indexRouter = require('./routes/index');
const bookShopRouter = require('./routes/bookshop');
const detailRouter = require('./routes/detail')
const listUser = require('./models/listUserModels');
const shopCart = require('./models/shopCartModels')

const app = express();


const url = "mongodb+srv://team-web:i031Onxb3JsJ0Gj9@cluster0.nhzle.mongodb.net/book-store?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Configure passport
// app.use(express.bodyParser());
app.use(session({ secret: "cats" }));
app.use(flash())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
// user
app.use(async function (req, res, next) {
  res.locals.user = req.user;
  if (req.user) { // Nếu có đăng nhập 
    if (!req.user.cartID) { // Nếu không có CartID
      const cart = await shopCart.initCart();
      await listUser.addCartID(req.user._id, cart._id)
    } 
    let lItem = await shopCart.listProduct(req.user.cartID);
    if (!lItem) {
      const cart = await shopCart.initCart();
      await listUser.addCartID(req.user._id, cart._id)
      lItem = await shopCart.listProduct(req.user.cartID);
    }
    res.locals.listItem = lItem;
  }
  else {
    const lItem = await shopCart.listProduct('5fe453a22329a4349fda3be2');
    res.locals.listItem = lItem;
  }
  next()
});
// Router
app.use('/', indexRouter);
app.use('/book-shop', bookShopRouter);
app.use('/product-detail', detailRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

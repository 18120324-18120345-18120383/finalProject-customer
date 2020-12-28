const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const bcrybt = require('bcrypt')
const fs = require('fs')


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    firstName : String,
    lastName: String,
    avatar: String,
    email: String,
    phoneNumber: String,
    more: String,
    cartID: String,
    orderID: [String],
    isActive: Boolean
})
const User = mongoose.model('list-users', userSchema);

module.exports.addOrderID = async (id, orderID) => {
    const user = await User.findById(id);
    user.orderID.push(orderID);
    user.save();
    return user;
}

module.exports.getListAccount = async () => {
    // const users = await User.find({});
    const users = await User.updateMany({}, {isActive: true})
    return users;
}
module.exports.addCartID = async (id, CartID) => {
    const user = await User.findByIdAndUpdate(id, {cartID: CartID});
    return user;
}
module.exports.updateOneAccount = async (id, fields) => {
    const newID = id;
    const filter = {_id: newID};
    
    let update = {
        firstName: fields.firstName, 
        lastName: fields.lastName, 
        phoneNumber: fields.phoneNumber,
        more: fields.more,
        avatar: '/book-shop/img/userAvatar/' + fields.avatar
    };
    if (fields.avatar === null) {
        update = {
            firstName: fields.firstName, 
            lastName: fields.lastName, 
            phoneNumber: fields.phoneNumber,
            more: fields.more
        }
    } else {
        //delete current avatar before update new avatar
        const currentAva = (await User.findOne(filter)).avatar 
        try { 
            fs.unlinkSync('./public' + currentAva)
            console.log("delete file successfully!!!")
        } catch (err){
            console.log(err)
        }
    }
    const user = await User.findOneAndUpdate(filter, update);
    return user;
}
module.exports.addOneAccount = async (firstName, lastName, avatar, email, phoneNumber, more) => {
    const user = await User.insertMany({
        firstName: firstName,
        lastName: lastName,
        avatar: avatar,
        email: email,
        phoneNumber: phoneNumber,
        more: more
    })
}
module.exports.checkValidAccount = async (data) => {
    const username = data.username;
    const password = data.password;
    const email = data.email;
    let message = "";
    let flag = await User.findOne({username: username}).exec();
    if (flag) {
        message = "Username exists!";
        return message
    }
    flag = await User.findOne({email: email}).exec();
    if (flag) {
        message = "Your email has been used already!";
        return message
    }
    if (password[0] != password[1]) {
        message = "Password and retype not match!";
        return message
    }
    
    message = "Valid account";
    return message;
}
module.exports.checkValidEmailAndUsername = async (email, username) => {
    let flag = await User.findOne({username: username}).exec();
    if (flag) {
        return false;
    }
    flag = await User.findOne({email: email}).exec();
    if (flag) {
        return false;
    }
    return true;
}
module.exports.createAccount = async(username, hashedPassword, email) => {
    const user = await User.insertMany({
        username: username,
        password: hashedPassword,
        email: email,
        isActive: true
    })
    return user;
}
module.exports.getUserByID = async (id) =>{
    const user = User.findById(id);
    return user;
}
module.exports.authenticateUser = async (username, password) => {
    //Check user use username or email to authenticate
    let user;
    if (username.indexOf('@') != -1){ 
        user = await User.findOne({email: username}).exec();
    } else {
        user = await User.findOne({username: username}).exec();
    }

    if (user == null) {
        return "An account with your username or email does not exist!!!";
    }
    let flag = await bcrybt.compare(password, user.password);
    if (!flag) {
        return "Your password is incorrect!!!";
    }
    if (!user.isActive) {
        return "Your account is blocked!!!";
    }
    return user;
}
module.exports.findUserByEmail = async (email) => {
    const user = await User.findOne({email: email}).exec();
    return user;
}
module.exports.setPasswordByEmail = async (email, newPassword) => {
    const filter = {email: email};

    const hashedPassword = await bcrybt.hash(newPassword, 10);

    let update = {
        password: hashedPassword
    };

    const user = await User.findOneAndUpdate(filter, update);
    return user;
}
module.exports.setPasswordByUsername = async (username, newPassword) => {
    const filter = {username: username};

    const hashedPassword = await bcrybt.hash(newPassword, 10);

    let update = {
        password: hashedPassword
    };

    const user = await User.findOneAndUpdate(filter, update);
    return user;
}
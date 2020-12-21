const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const bcrybt = require('bcrypt')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    firstName : String,
    lastName: String,
    avatar: String,
    email: String,
    phoneNumber: String,
    more: String
})
const User = mongoose.model('list-users', userSchema);

module.exports.getListAccount = async () => {
    const users = await User.find({});
    return users;
}
module.exports.updateOncAccount = async (id, fields) => {
    const newID = id;
    const filter = {_id: newID};
    
    let update = {
        firstName: fields.firstName, 
        lastName: fields.lastName, 
        email: fields.email, 
        phoneNumber: fields.numberPhone,
        more: fields.more,
        avatar: '/book-shop/img/' +fields.avatar
    };
    if (!fields.avatar) {
        update = {
            firstName: fields.firstName, 
            lastName: fields.lastName, 
            email: fields.email, 
            phoneNumber: fields.numberPhone,
            more: fields.more
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
module.exports.createAccount = async (data) => {
    const username = data.username;
    const password = data.password;
    console.log(username);
    console.log(password[0])
    let message = "";
    const flag = await User.findOne({username: username}).exec();
    // const flag = false;
    if (flag) {
        message = "Username exists!";
        return message
    }
    if (password[0] != password[1]) {
        message = "Password and retype not match!";
        return message
    }
    const hashedPassword = await bcrybt.hash(password[0], 10);
    const user = await User.insertMany({
        username: username,
        password: hashedPassword
    })
    message = "Create account successful!";
    return message;
}
module.exports.getUserByID = async (id) =>{
    const user = User.findById(id);
    return user;
}
module.exports.authenticateUser = async (username, password) => {
    const user = await User.findOne({username: username}).exec();

    if (user == null) {
        return false;;
    }
    let flag = await bcrybt.compare(password, user.password);
    if (flag) {
        return user;
    }
    return false;
}


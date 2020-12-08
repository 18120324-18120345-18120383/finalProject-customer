const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName : String,
    lastName: String,
    avatar: String,
    email: String,
    numberPhone: String,
    more: String
})

const User = mongoose.model('list-users', userSchema);

module.exports.getListAccount = async () => {
    const users = await User.find({});
    return users;
}
module.exports.updateOncAccount = async (id, fields) => {
    const newID = mongoose.Types.ObjectId(id);  
    const filter = {_id: newID};
    
    let update = {
        firstName: fields.firstName, 
        lastName: fields.lastName, 
        email: fields.email, 
        numberPhone: fields.numberPhone,
        more: fields.more,
        avatar: '/book-shop/img/' +fields.avatar
    };
    if (!fields.avatar) {
        update = {
            firstName: fields.firstName, 
            lastName: fields.lastName, 
            email: fields.email, 
            numberPhone: fields.numberPhone,
            more: fields.more
        }
    }
    const user = await User.findOneAndUpdate(filter, update);
    return user;
}
module.exports.addOneAccount = async (firstName, lastName, avatar, email, numberPhone, more) => {
    const user = await User.insertMany({
        firstName: firstName,
        lastName: lastName,
        avatar: avatar,
        email: email,
        numberPhone: numberPhone,
        more: more
    })
}
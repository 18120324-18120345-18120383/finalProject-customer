const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const bcrybt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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
passport.initialize();
passport.session();

initializePassport(
    passport,
)
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

function initializePassport(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await User.findOne({username: username}).exec();
        if (user == null) {
            return done(null, false, { message: "Username or password is incorrect!!!" })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log(password)
                return done(null, user)
            }
            else {
                return done(null, false, { message: "Username or password is incorrect!!!" })
            }
        }
        catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({
        usernameField: 'username'
    },
        authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}
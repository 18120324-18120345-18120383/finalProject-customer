const books = require('../models/listBookModels')
const users = require('../models/listUserModels')
const bcrypt = require('bcrypt')

exports.authenPassword = async (req, res, next) => {
    const isValidPass = await bcrypt.compare(req.query.password, req.user.password)
    res.send(isValidPass)
}
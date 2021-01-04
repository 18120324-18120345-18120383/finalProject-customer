const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema ({
    name: String,
    numberOfBook: Number
})

const Categories = mongoose.model('Categories', categorySchema);
module.exports.categories = async () => {
    const categories = await Categories.find()
    return categories;
}
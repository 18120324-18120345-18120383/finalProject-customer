const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema ({
    name: String,
    numberOfBook: Number
})

const Categories = mongoose.model('Categories', categorySchema);

module.exports.findCategories = async (filter = null) => {
    const categories = await Categories.find(filter)
    return categories;
}

module.exports.updateCategory = async (filter, update) => {
    const category = await Categories.findOneAndUpdate(filter, update)
    return category
}

module.exports.addOneBookToCategory = async (filter) => {
    //find the category of the book
    let category = await Categories.find(filter)
    
    //increase number of books
    let newNumOfBooks = category.numberOfBook + 1;
    
    //update number of books
    const update = { numberOfBook: newNumOfBooks }
    category = await Categories.findOneAndUpdate(filter, update)

    return category
}
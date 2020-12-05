const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name : String,
    cover: [String],
    categories: [String],
    basePrice: Number,
    description: String
})

const Book = mongoose.model('list-books', bookSchema);

module.exports.listBook = async () => {
    const books = await Book.find();
    return books;
}

module.exports.getOneBook = async (id) => {
    const book = await Book.findById(id);
    return book;
}

// module.exports.addManyBook = async () => {
//     const books
// }
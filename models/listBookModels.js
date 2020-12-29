const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name : String,
    cover: [String],
    category: String,
    categoryID: ObjectID,
    basePrice: Number,
    description: String,
    views: Number
})

bookSchema.plugin(mongoosePaginate);
const Book = mongoose.model('list-books', bookSchema);

module.exports.listBook = async (filter, sort, pageNumber, itemPerPage) => {
    if (sort) {
        let books = await Book.paginate(filter, {
            page: pageNumber,
            limit: itemPerPage,
            sort: {basePrice: sort}
        }); 
        return books;
    }
    let books = await Book.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    }); 
    return books;
}

module.exports.getOneBook = async (id) => {
    let book = await Book.findById(id);
    if (book) {
        // noting 
    }
    else {
        console.log("book not exists");
    }
    let views = 0;
    if (book.views) {
        views = book.views
    }
    book = await Book.findByIdAndUpdate(id, {views: views + 1})
    return book;
}

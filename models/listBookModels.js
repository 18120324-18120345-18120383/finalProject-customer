const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: String,
    coversString: [String],
    category: String,
    categoryID: ObjectID,
    basePrice: Number,
    description: String,
    views: Number,
    buyCount: Number
})

bookSchema.plugin(mongoosePaginate);
const Book = mongoose.model('books', bookSchema);
module.exports.listBook = async (filter, sort, pageNumber, itemPerPage) => {
    // console.time("runtime product listing");
    if (sort) {
        let books = await Book.paginate(filter, {
            page: pageNumber,
            limit: itemPerPage,
            sort: { basePrice: sort }
        });
        return books;
    }
    let books = await Book.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    // console.timeEnd("runtime product listing");
    return books;
}
module.exports.addBuyCount = async (id) => {    
    let book = await Book.findOne({ _id: id });
    if (book.buyCount) {
        book.buyCount = book.buyCount + Number(1);
    }
    else {
        book.buyCount = 1;
    }
    await book.save();
}
module.exports.getOneBook = async (id) => {
    let book = await Book.findById(id);
    let views = 0;
    if (book) {
        if (book.views) {
            views = book.views
        }
    }
    else {
        console.log("book not exists");
        return false;
    }
    book.views = views + 1;
    book.save();
    return book;
}

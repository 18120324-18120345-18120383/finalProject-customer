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
    description: String
})

bookSchema.plugin(mongoosePaginate);
const Book = mongoose.model('list-books', bookSchema);

module.exports.listBook = async (filter, pageNumber, itemPerPage) => {
    let books = await Book.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    // console.log(books.docs);
    return books;
}

module.exports.getOneBook = async (id) => {
    const book = await Book.findById(id);
    return book;
}

module.exports.searchBook = async (nameBook) => {
    const books = await Book.find({name : { "$regex": nameBook, "$options": "i" }}).exec();
    return books;
}
module.exports.addManyBook = async () => {
    const books = await Book.insertMany([
        {
            name: "To Kill a Mockingbird",
            cover: ["img/book-3.jpg", "img/book-1-1.jpg", "img/book-1-2.jpg"],
            category: "Drama",
            categoryID: mongoose.Types.ObjectId('5fcca69f41329f2ca085b7ba'),
            basePrice: 80,
            description: "If you are a small business and you are interested in small rebranding then this is a perfect plan for you, having Five years experience in Blogging, photographing, Disgning and love to cycling,Writting,Singing and Traveling around the world"
        },
        {
            name: "1984",
            cover: ["img/book-3-1.jpg", "img/book-2-1.jpg", "img/book-2.jpg"],
            category: "Art",
            categoryID: mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b4'),
            basePrice: 89,
            description: "If you are a small business and you are interested in small rebranding then this is a perfect plan for you, having Five years experience in Blogging, photographing, Disgning and love to cycling,Writting,Singing and Traveling around the world"
        },
        {
            name: "Harry Potter and the Philosopher’s Stone",
            cover: ["img/book-4.jpg", "img/book-1-1.jpg", "img/book-3.jpg"],
            category: "Health",
            categoryID: mongoose.Types.ObjectId('5fcca69f41329f2ca085b7bd'),
            basePrice: 111,
            description: "If you are a small business and you are interested in small rebranding then this is a perfect plan for you, having Five years experience in Blogging, photographing, Disgning and love to cycling,Writting,Singing and Traveling around the world"
        },
        {
            name: "The Lord of the Rings",
            cover: ["img/book-4-1.jpg", "img/book-1-1.jpg", "img/book-1-2.jpg"],
            category: "History",
            categoryID: mongoose.Types.ObjectId('5fcca69f41329f2ca085b7be'),
            basePrice: 69,
            description: "If you are a small business and you are interested in small rebranding then this is a perfect plan for you, having Five years experience in Blogging, photographing, Disgning and love to cycling,Writting,Singing and Traveling around the world"
        },
        {
            name: "The Great Gatsby",
            cover: ["img/book-5.jpg", "img/book-1-1.jpg", "img/book-1-2.jpg"],
            category: "Chick lit",
            categoryID: mongoose.Types.ObjectId('5fcca69f41329f2ca085b7b7'),
            basePrice: 99,
            description: "If you are a small business and you are interested in small rebranding then this is a perfect plan for you, having Five years experience in Blogging, photographing, Disgning and love to cycling,Writting,Singing and Traveling around the world"
        }
    ])
    return books;
}
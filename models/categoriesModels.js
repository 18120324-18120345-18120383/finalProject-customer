const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema ({
    name: String,
    numberOfBook: Number
})

const Categories = mongoose.model('Categories', categorySchema);
module.exports.categories = async () => {
    const categories = await Categories.find()
    console.log(categories[1]._id);
    return categories;
}
module.exports.addManyCategory = async () => {
    const categories = await Categories.insertMany([
        {
            name: "Art",
            numberOfBook: 5
        },
        {
            name: "Autobiography",
            numberOfBook: 4
        },
        {
            name: "Biography",
            numberOfBook: 9
        },
        {
            name: "Chick Lit",
            numberOfBook: 11
        },
        {
            name: "Comming-Of-Age",
            numberOfBook: 3
        },
        {
            name: "Anthology",
            numberOfBook: 7
        },
        {
            name: "Drama",
            numberOfBook: 10
        },
        {
            name: "Crime",
            numberOfBook: 8
        },
        {
            name: "Dictionary",
            numberOfBook: 4
        },
        {
            name: "Health",
            numberOfBook: 7
        },
        {
            name: "History",
            numberOfBook: 10
        },
        {
            name: "Hornor",
            numberOfBook: 5
        },
        {
            name: "Poetry",
            numberOfBook: 15
        },
    ]);
    return categories;
}
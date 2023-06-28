// category model
const mongoose = require('mongoose')


//schema with names slugs and date
const schema = new mongoose.Schema({
    name: {
        type: String, require: true
    },
    slug: {
        type: String, require: true
    }, date: {
        type: Date,
        default: Date.now()
    }
})

// make model
const Category = mongoose.model('categories', schema)


module.exports = Category
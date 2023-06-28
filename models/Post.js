// creating post model
const { default: mongoose, connection, Schema } = require("mongoose");


const schema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        require: true
    },
    slug: {
        type: String,
        require: true
    }

})


const Post = mongoose.model('Posts', schema)

module.exports = Post
//users model

const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    password:{
        type: String,
        required: true
    }
})

const User = mongoose.model('User', schema)


module.exports = User
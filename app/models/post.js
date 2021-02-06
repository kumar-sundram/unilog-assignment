const mongoose = require('mongoose')
const validator = require('validator')

const { Schema } = mongoose
const postSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    image: [{
        type: String,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Posts = mongoose.model('posts', postSchema)

module.exports = {
    Posts
}
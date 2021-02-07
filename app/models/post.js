const mongoose = require('mongoose')
const validator = require('validator')

const { Schema } = mongoose
const postSchema = new Schema({
  text: {
    type: String,
  },
  image: [{
    type: String,
  }],
  user: {
    type: {id:Schema.Types.ObjectId,name:Schema.Types.String},
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Dash = mongoose.model('Dash', postSchema)

module.exports = {
  Dash
}
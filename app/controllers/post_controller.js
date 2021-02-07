const express = require('express')
const router = express.Router()
const { Dash } = require('../models/post')
const { upload } = require('../middleware/imageUploads')
const { authenticate } = require('../middleware/authenticate')

router.get('/', authenticate, (req, res) => {
  Dash.find()
    .then((post) => {
      if (post) {
        res.send(post)
      } else {
        res.send({ notice: "No Posts" })
      }
    })
    .catch((err) => {
      res.send(err)
    })
})

router.post('/', upload.array('image', 4), authenticate, (req, res) => {
  const body = req.body
  const images = []
  req.files.forEach(item => {
    const imageUrl = item.destination
    const link = "http://localhost:3001" + imageUrl.slice(1) + item.filename
    images.push(link)
  })
  body.image = images
  const data = new Dash(body)
  data.user = {id:req.user._id, name: req.user.name}
  data.save()
    .then((post) => {
      res.send(post)
    })
    .catch((err) => {
      res.send(err)
    })
})

module.exports = {
  postsRouter: router
}
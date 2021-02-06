const express = require('express')
const multer = require('multer')
const router = express.Router()
const { Post } = require('../models/post')
const { upload } = require('../middleware/imageUploads')
const { authenticate } = require('../middleware/authenticate')

router.get('/', authenticate, (req, res) => {
    Post.find()
        .then((props) => {
            if (props) {
                res.send(props)
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
    req.files.forEach(file => {
        const imageUrl = file.destination
        const link = "http://localhost:3001" + imageUrl.slice(1) + file.filename
        images.push(link)
    })
    body.image = images
    const posts = new Post(body)
    posts.user = req.user._id
    posts.save()
        .then((props) => {
            res.send(props)
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = {
    postsRouter: router
}
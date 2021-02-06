const express = require('express')
const mongoose = require('./config/database')
const cors = require('cors')
const { postsRouter } = require('./app/controllers/post_controller')
const { usersRouter } = require('./app/controllers/users_controllers')

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())
app.use('/public/uploads', express.static('public/uploads'))

app.get('/', (req, res) => {
    res.send('Welcome To Unilog')
})

app.use('/post', postsRouter)
app.use('/users', usersRouter)

app.listen(port, () => {
    console.log('listening to port', port)
})
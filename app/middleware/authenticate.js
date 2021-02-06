const { User } = require('../models/user')

function authenticate(req, res, next) {
    const token = req.header('x-auth')
    if (token) {
        User.findByToken(token)
            .then((user) => {
                req.user = user,
                    req.token = token
                next()
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        res.send({ notice: 'token not provided' })
    }
}

module.exports = {
    authenticate
}
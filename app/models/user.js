const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Schema } = mongoose
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(value) {
                return validator.isEmail(value)
            },
            message: function() {
                return 'invalid email format'
            }
        }
    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 128,
        required: true
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})

userSchema.pre('save', function(next) {
    if (this.isNew) {
        bcryptjs.genSalt(10).then((salt) => {
            bcryptjs.hash(this.password, salt)
                .then((hashedPassword) => {
                    this.password = hashedPassword
                    next()
                })
        })
    } else {
        next()
    }
})

userSchema.statics.findByEmailAndPassword = function(email, password) {
    const User = this
    return User.findOne({
            email
        })
        .then((user) => {
            if (user) {
                return bcryptjs.compare(password, user.password).then((result) => {
                    if (result) {
                        return Promise.resolve(user)
                    } else {
                        return Promise.reject('invalid password or email')
                    }
                })
            } else {
                return Promise.reject('invalid email or password')
            }
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}
userSchema.methods.generateToken = function() {
    const user = this
    const tokenData = {
        userId: user._id,
        role: user.role,
        firstName: user.firstName
    }
    const token = jwt.sign(tokenData, 'sachin123')
    user.tokens.push({
        token
    })
    return user.save().then((user) => {
        return token
    }).catch((err) => {
        return err
    })
}

userSchema.statics.findByToken = function(token) {
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'sachin123')
    } catch (err) {
        return Promise.reject(err)
    }
    return User.findOne({
            _id: tokenData.userId,
            'tokens.token': token
        })
        .then((user) => {
            console.log('insideFindByToken')
            return Promise.resolve(user)
        })
        .catch((err) => {
            console.log('insideFindByCatch')
            return Promise.reject(err)
        })
}
const User = mongoose.model('User', userSchema)

module.exports = {
    User
}
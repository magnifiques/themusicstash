const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },
    
    image: {
        type: String,
        required: true
    },

    albums: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Album'
    }]
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
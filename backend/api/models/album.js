const mongoose = require('mongoose')

const albumSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    title: {
        type: String,
        required: true
    },

    artist: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    
    year : {
        type: Number,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Album', albumSchema);
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to mongodb')
    })
    .catch(err => {
        console.log(err.message)
    })

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        required: true
    },
    club: {
        type: String,
        minlength: 5,
        required: true
    },
    important: Boolean
})

playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Player', playerSchema)

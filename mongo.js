const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide a password')
    process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://falsteck:${password}@cluster0-vicxc.mongodb.net/bestapp?retryWrites=true&w=majority`


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const playerSchema = new mongoose.Schema({
    name: String,
    club: String,
    important: Boolean
})

const Player = mongoose.model('Player', playerSchema)

const player = new Player({
    name: 'plz work',
    club: 'ok?',
    important: true
})

// Player.find({important: false}).then(data => {
//     data.forEach(el => console.log(el))
//     mongoose.connection.close()
// })

player.save()
    .then(data => {
        console.log(data, 'saved!')
        mongoose.connection.close()
    })

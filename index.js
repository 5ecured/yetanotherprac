require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Player = require('./models/player')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)




let players = [
    { id: 1, name: "Cristiano Ronaldo", club: "Juventus", important: true },
    { id: 2, name: "Lionel Messi", club: "Barcelona", important: false },
    { id: 3, name: "Kaka", club: "AC Milan", important: true },
    { id: 4, name: "Ronaldinho", club: "Barcelona", important: true },
    { id: 5, name: "Deco", club: "Barcelona", important: false }
]

app.get('/', (req, res) => {
    res.send('<h1>Prac prac</h1>')
})

app.get('/players', (req, res) => {
    Player.find({}).then(data => res.send(data.map(d => d.toJSON())))
})

app.get('/players/:id', (req, res, next) => {
    const id = Number(req.params.id)
    Player.findById(id)
        .then(data => {
            if (data) {
                res.send(data.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.delete('/players/:id', (req, res) => {
    const id = Number(req.params.id)
    Player.findByIdAndRemove(id).then(data => {
        res.status(204).end()
    })
        .catch(err => {
            console.log(err)
            res.status(404).send('malformatted id')
        })
})

app.post('/players', (req, res) => {
    const body = req.body
    if (!body.name || !body.club) {
        return res.status(400).send('Name or club cannot be missing')
    }

    const player = new Player({
        name: body.name,
        club: body.club,
        important: false
    })

    player.save().then(data => {
        res.send(data.toJSON())
    })
        .catch(err => {
            console.log(err)
            res.status(404).send('malformatted id')
        })
})

app.put('/players/:id', (req, res) => {
    const id = Number(req.params.id)
    const body = req.body

    const newPlayer = {
        id: body.id,
        name: body.name,
        club: body.club,
        important: body.important
    }

    Player.findByIdAndUpdate(id, newPlayer, { new: true }).then(data => {
        res.send(data.toJSON())
    })
})

app.patch('/players/:id', (req, res) => {
    const id = Number(req.params.id)
    const body = req.body

    const updatedPlayer = { ...body, important: !body.important }
    players = players.map(p => p.id === id ? updatedPlayer : p)
    res.send(updatedPlayer)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

let players = [
    { id: 1, name: "Cristiano Ronaldo", club: "Juventus", important: true },
    { id: 2, name: "Lionel Messi", club: "Barcelona", important: false },
    { id: 3, name: "Kaka", club: "AC Milan", important: true },
    { id: 4, name: "Ronaldinho", club: "Barcelona", important: true },
    { id: 5, name: "Deco", club: "Barcelona", important: false }
]

const generateId = () => {
    const maxId = players.length > 0 ? Math.max(...players.map(p => p.id)) : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Prac prac</h1>')
})

app.get('/players', (req, res) => {
    res.send(players)
})

app.get('/players/:id', (req, res) => {
    const id = Number(req.params.id)
    const player = players.find(p => p.id === id)
    res.send(player)
})

app.delete('/players/:id', (req, res) => {
    const id = Number(req.params.id)
    players = players.filter(player => player.id !== id)
    res.status(204).end()
})

app.post('/players', (req, res) => {
    const body = req.body
    if(!body.name || !body.club) {
        return res.status(400).send('Name or club cannot be missing')
    }
    body.id = generateId()
    body.important = false

    players = players.concat(body)
    res.send(body)
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
    players = players.map(p => p.id === id ? newPlayer : p)
    res.send(newPlayer)
})

app.patch('/players/:id', (req, res) => {
    const id = Number(req.params.id)
    const body = req.body

    const updatedPlayer = {...body, important: !body.important}
    players = players.map(p => p.id === id ? updatedPlayer : p)
    res.send(updatedPlayer)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
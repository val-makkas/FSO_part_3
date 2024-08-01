const express = require('express');
const cors = require('cors')
const morgan = require('morgan');

const app = express();

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


morgan.token('body', (req, res) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(notes);
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${notes.length} people</p> <p>${new Date()}</p>`);
})

app.get('/api/persons/:id', (req, res) => {
    const note = notes.find(note => note.id === req.params.id)
    
    if(note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if(notes.find(note => note.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const note = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 2000)
    }

    notes = notes.concat(note)
    res.json(note)
})

app.delete('/api/persons/:id', (req, res) => {
    notes = notes.filter(note => note.id !== req.params.id)
    res.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const Person = require('./models/person')

const app = express();

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


morgan.token('body', (req, res) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${notes.length} people</p> <p>${new Date()}</p>`);
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
    if (person) {
        res.json(person)
    } else {
        res.status(404).end() 
    }
    })
    .catch(error => {next(error)})
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedEntry => {
        res.json(savedEntry)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const {name, number} = req.body

    Person.findByIdAndUpdate(
        req.params.id,
        {name, number},
        {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
    })


app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

app.use(errorHandler)
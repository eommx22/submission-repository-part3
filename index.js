require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Entry = require('./models/entry')

app.use(express.json())
app.use(express.static('dist'))
 
morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.use(cors())


let length = 0

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
  
    response.json(entries)
  })
})


app.get('/info', (request, response) => {  

   Entry.find({}).then(entries => {
    length = entries.length
  
   response.send(`<div><p>Phonebook has info for ${length} people</p>
   <p>${new Date()}</p></div>`)

  })
 } )

app.get('/api/persons/:id', (request, response) => {
  Entry.findById(request.params.id).then(entry => {
    response.json(entry)
  })
})

app.delete('/api/persons/:id', (request, response) => {
 
  Entry.findByIdAndRemove(request.params.id).then(entry => {
    response.json(entry)
  })
    
    })

app.put('/api/persons/:id', (request, response, next) => {

      const { name, number } = request.body
    
      Entry.findByIdAndUpdate(
        request.params.id, 
    
        { name, number },
        { new: true, runValidators: true, context: 'query' }
      ) 
        .then(updatedEntry => {
          response.json(updatedEntry)
        })
      //  .catch(error => next(error))
      .catch(error => {if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }})
})


 
app.post('/api/persons', (request, response, next) => {
      const body = request.body

      if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
    
      if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    
      const entry = new Entry({
        name: body.name,
        number: body.number,
      }) 
    
      entry.save()
        .then(savedNote => {
          response.json(savedNote)
        })
        .catch(error => next(error))
   
    })    



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
     console.log(`App running on port ${PORT}`)
 })

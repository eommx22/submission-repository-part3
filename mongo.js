const mongoose = require('mongoose')

 if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://eo22mmx:${password}@cluster0.pzldeds.mongodb.net/bookEntry?retryWrites=true&w=majority`
 
 

mongoose.set('strictQuery',false)
mongoose.connect(url)

.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

const entrySchema = new mongoose.Schema({
  name:  {
    type: String,
    minLength: 3,
    required: [true, 'Person name required']
  },
  number:  {
    type: String,
    minLength: 8,
    required: [true, 'Phone number required']
  },
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
 

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 5)
 {
  const name = process.argv[3]
  const number = process.argv[4]

  const entry = new Entry({
  name: name,
  number: number,
}) 
  
  entry.save().then(result => {
    console.log('person, number saved!')

  })


   Entry.find({}).then(result => {
     console.log('Phonebook:')
     console.log('')
     result.forEach(entry => {
       console.log(`${entry.name} ${entry.number}`)
     })
     mongoose.connection.close()


})
 }


module.exports = mongoose.model('Entry', entrySchema)
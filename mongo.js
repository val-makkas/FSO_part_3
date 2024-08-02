/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

const password = process.argv[2]

const url =`mongodb+srv://fullstack:${password}@phonebook-db.b2z2jmc.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const phonebookEntry = mongoose.model('Entries', phonebookSchema)

if (process.argv.length === 3) {
  phonebookEntry
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(entry => {
        console.log(entry.name, entry.number)
      })
      mongoose.connection.close()
    })
}
else if (process.argv.length === 5) {

  const name = process.argv[3]

  const number = process.argv[4]

  const entry = new phonebookEntry({
    name: name,
    number: number,
  })

  entry.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
else if (process.argv.length<5) {
  console.log('at least password, name and number are required as arguments')
  process.exit(1)
}
else
{
  console.log('too many arguments, make sure name is in quotes')
  process.exit(1)
}


const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
	content: String,
	date: Date,
	important: Boolean
})

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Note = model('Note', noteSchema)

//Note.find({})
//	.then(res => {
//		console.log(res)
//		mongoose.connection.close()
//	})

//const note = new Note({
//	content: 'MongoDB is incredible',
//	date: new Date(),
//	important: true
//})
//
//note.save()
//	.then(res => {
//		console.log(res)
//		mongoose.connection.close()
//	})
//	.catch(err => {
//		console.log(err)
//	})

module.exports = Note

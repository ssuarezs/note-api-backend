const mongoose = require('mongoose')

// conection to mongodb
mongoose.connect(process.env.MONGO_DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		console.log('Database connected')
	})
	.catch(err => {
		console.log({err})
	})

process.on('uncaughtException', () => {
	mongoose.connection.disconect()
})

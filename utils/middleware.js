const jwt = require('jsonwebtoken')
const logger = require('./logger')

const ERROR_HANDLERS = {

  CastError: res => 
    res.status(400).send({ error: 'malformatted id' }),

  ValidationError: (res, { message }) => 
    res.status(409).send({ error: message }),

  JsonWebTokenError: res => 
    res.status(401).send({ error: 'token missing or invalid' }),

  defaultError: res => res.status(500).end()

}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next(error)
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.name)
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(response, error)
}

const userExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  let token = null

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY)

  if (!token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const { id: userId } = decodedToken
  request.userId = userId
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
}

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validate-bearer-token')
const logger = require('./logger')
const bookmarksRouter = require('./bookmarks/bookmarks-router')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'dev';
const app = express()

app.use(morgan(morganOption, {skip: () => NODE_ENV === 'test'}))

app.use(cors())
app.use(helmet())
app.use(validateBearerToken)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
  response = { error: { message: 'server error' } }
  } else {
  console.error(error)
  logger.error(error.message)
  response = { message: error.message, error }
  }
  res.status(500).json(response)
  })

  app.use(bookmarksRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
    })

module.exports = app
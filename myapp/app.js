// environment variables
process.env.NODE_ENV = 'development'
const config = require('./config/config_setup') // Init config. Don't delete.

const express = require('express')
const app = express()
const passport = require("passport")
const bodyParser = require("body-parser")
const auth = require('./middlewares/auth') // Init auth. Don't delete.
const fileUpload = require('express-fileupload')

// Middleware error handler for json response
function handleError(err, req, res, next) {
    const output = {
        error: {
            name: err.name,
            message: err.message,
            text: err.toString()
        }
    }
    const statusCode = err.status || 500
    res.status(statusCode).json(output)
}

// Passport init for authentication.
app.use(passport.initialize())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// Create file upload
app.use(fileUpload())

// Create routes.
app.use(require('./controllers'))

// Connect to database
const restaurantRepository = require('./services/RestaurantRepository');

(async () => {
    await restaurantRepository.createDatabaseIfNotExist()
    restaurantRepository.connect()
})()

// Start app
app.listen(global.gConfig.node_port, function () {
    console.log(`${global.gConfig.app_name} listening on port ${global.gConfig.node_port}`)
})
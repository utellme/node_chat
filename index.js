let path = require('path')
let express = require('express')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let mongoose = require('mongoose')
let requireDir = require('require-dir')
let flash = require('connect-flash')


const NODE_ENV = process.env.NODE_ENV || 'development'

let App = require('./app/app')

let config = requireDir('./config', {recurse: true})

// app.config = {
// 		  database: config.database[NODE_ENV]
// 		}

let port = process.env.PORT || 8000
let app = new App(config, port)

app.initialize(port)
  .then(()=> console.log(`Listening @ http://127.0.0.1:${port}`))
  // ALWAYS REMEMBER TO CATCH!
  .catch(e => console.log(e.stack ? e.stack : e))


// connect to the database
// mongoose.connect(app.config.database.url)

// set up our express middleware


// start server
//app.listen(port, ()=> console.log(`Listening @ http://127.0.0.1:${port}`))

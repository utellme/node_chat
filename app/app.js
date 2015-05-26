let path = require('path')
let express = require('express')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let mongoose = require('mongoose')
let MongoStore = require('connect-mongo')(session)
let requireDir = require('require-dir')
let flash = require('connect-flash')
let Server = require('http').Server
let io = require('socket.io')
let route = require('./routes')
let browserify = require('browserify-middleware')

require ('songbird')


class App {

    constructor(config, port) {

    	let app = express()
    	this.port = port || 8000

    	//this.server = Server(app)
		
        
        app.use(morgan('dev')) // log every request to the console
		app.use(cookieParser('ilovethenodejs')) // read cookies (needed for auth)
		app.use(bodyParser.json()) // get information from html forms
		app.use(bodyParser.urlencoded({ extended: true }))

		app.set('views', path.join(__dirname, 'views'))
		app.set('view engine', 'ejs') // set up ejs for templating

		// required for passport

		this.sessionMiddleware = session({
		  secret: 'ilovethenodejs',
		  store: new MongoStore({db: 'socialchat'}),
		  resave: true,
		  saveUninitialized: true
		})

		app.use(this.sessionMiddleware)

		// // configure routes
		require('./routes')(app)

       
		this.server = Server(app)
		this.io = io(this.server)
		// app.use(flash())


		browserify.settings({
            transform: ['babelify']
        })
        app.use('/js/index.js', browserify('./public/js/index.js'))

  
        this.io.use((socket, next) => {
            this.sessionMiddleware(socket.request, socket.request.res, next)
        })

        // And add some connection listeners:
        this.io.on('connection', socket => {
            // console.log('a user connected')
            let username = socket.request.session.username
            console.log("*** socket.request.session",  socket.request.session)
            socket.on('im', msg => {
                // im received
                console.log("*** username", username)
                console.log(msg)
                // echo im back
                this.io.emit('im', {
                    username, msg
                })
            })
            socket.on('disconnect', () => console.log('user disconnected'))
        })

    }

    async initialize(port) {

    		console.log("Initialize: " + this.server)
            await this.server.promise.listen(port)
            // Return this to allow chaining
            return this
     }
}

module.exports = App
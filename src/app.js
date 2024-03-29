import express from 'express'
import {Server} from 'socket.io'
import __dirname from './utils/dirname.js'
import handlebars from 'express-handlebars'
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import mongoose from 'mongoose'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.routes.js'
import sessionsRouter from './routes/sessions.router.js'
import usersViewsRouter from './routes/users.views.router.js'
import Handlebars from "handlebars";
import session from 'express-session'
import MongoStore from 'connect-mongo'
import path from 'path'
import passport from 'passport';
import initializePassport from './config/auth/passport.config.js';
import config from './config/env.config.js'

const app = express()

let messages = []
const port = config.port
const mongo_url = config.urlMongo
const session_secret = config.sessionSecret

app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  }))

app.set('views',path.join(__dirname , '../views'))
app.set('view engine','hbs')
app.use(express.static(path.join(__dirname,'../public')))


app.use(session({

  store: MongoStore.create({
    mongoUrl: mongo_url, 
    mongoOptions:{ useNewUrlParser:true, useUnifiedTopology:true},
    ttl:10 * 60
  }),

  secret: session_secret,
  resave:false,
  saveUninitialized:true

}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/sessions', sessionsRouter)
app.use('/users',usersViewsRouter)

app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)
app.use('/',viewsRouter)

const httpServer = app.listen(port, ()=>{console.log("Listening on port " + port)})

const io = new  Server(httpServer)
io.on('connection',socket =>{
  io.emit('messageLogs', messages)
socket.on('message',data =>{

  messages.push(data)
  io.emit('messageLogs', messages)
})

})
mongoose
    .connect(mongo_url)
    .then( db => console.log(`-> sucessfuly connected to database.`) )
    .catch( err => console.error(`-> can't connect to database due to following error: ${err}.`) )
const path = require('path');
const express = require('express');
const app = express()
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise
const LocalStrategy = require('passport-local');
const passport = require('passport');
const PORT = process.env.PORT || 3000

//models
const votingData = require('../models/votingdata')
const User = require('../models/user')

//Require Routes
const Router = require('../routes/index')
const Vote = require('../routes/Vote')


app.use(express.static(path.resolve(__dirname, '../public')))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
//express server



app.use(require('express-session')({
  secret: 'baby blues',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
  res.locals = {
    user: req.user,
    options: {},
    svg: ''
  }
  console.log(`App.use.vote:`, res.locals.svg);
  next()
})


app.use(Router)
app.use(Vote)

if(process.env.NODE_ENV !== 'production'){
  MONGODB_URI = 'mongodb://localhost/d3_vote'
} else {
  MONGODB_URI = process.env.MONGODB_URI
  // process.env.MONGOLAB_URI
}

//local server
mongoose.connect(MONGODB_URI)
  .then(()=>console.log('connected to mongodb'))
  .catch((err)=>console.log('DB connection - NONE'))


app.listen(PORT, ()=>{
  console.log(`server is on port: ${PORT}`);
})
console.log(MONGODB_URI);

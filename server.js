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
const votingData = require('./models/votingdata')
const User = require('./models/user')

//Require Routes
const Router = require('./routes/index')


app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs')
//express server

if(process.env.NODE_ENV !== 'production'){
  MONGODB_URI = 'mongodb://localhost/d3_vote'
} else {
  MONGODB_URI = process.env.MONGODB_URI
}

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

app.use(Router)

app.get('/votes', (req, res)=>{
  res.render('index')
})





//local server
mongoose.connect(MONGODB_URI)
  .then(()=>console.log('connected to mongodb'))
  .catch((err)=>console.log(err))


app.listen(PORT, ()=>{
  console.log(`server is on port: ${PORT}`);
})

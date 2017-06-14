const auth = require('../controllers/Home_Auth')
const router = require('express').Router({mergeParams: true})
const User = require('../models/user')

const isLoggedin = ((req, res, next)=>{
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
})

//home
router.get('/', auth.home)

//Register
router.get('/register', auth.register)
router.post('/register', auth.postRegister)

//Login
router.get('/login', auth.login)
router.post('/login', auth.postlogin)

//logout
router.get('/logout', auth.logout)

module.exports = router

const express = require('express');
const passport = require('passport');
const User = require('../models/user')
const votingData = require('../models/votingdata')

const userController = {}

userController.home = (req, res)=>{
    console.log('userController.home',req.user);
  res.render('home_auth/home', {
      user: req.user
  })
}


userController.register = (req, res)=>{
  res.render('home_auth/register')
}

userController.postRegister =  (req, res)=>{
User.register(new User({
  username: req.body.username,
}), req.body.password, (err, user)=>{
  if(err){console.log(err);}
  else {
  res.redirect('/votes/user')

  }
})
}

userController.login = (req, res)=>{
    console.log(req.user);
  res.render('home_auth/login')
}
//post

userController.postlogin = (req, res)=>{

  passport.authenticate('local', {
    successRedirect: '/votes',
  failureRedirect: '/login',
  })(req, res, ()=>{
  })
}

userController.logout = (req, res)=>{
  req.logout()
  res.redirect('/')
}


module.exports = userController

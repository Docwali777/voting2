const express = require('express');
const votingData = require('../models/votingdata')
const User = require('../models/user')

const user = {}

user.index = (req, res)=>{
  console.log(res.locals);
res.render('user/index')

}

module.exports = user

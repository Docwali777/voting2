const express = require('express');
const router = express.Router({mergeParams: true})
const votingdata = require('../models/votingdata')
const user = require('../controllers/User')



router.get('/votes/user', user.index)


module.exports = router

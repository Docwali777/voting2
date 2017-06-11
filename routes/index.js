const auth = require('../controllers/Home_Auth')
const router = require('express').Router()

//home
router.get('/', auth.home)

//Register
router.get('/register', auth.register)
router.post('/register', auth.postRegister)

//Login
router.get('/login', auth.login)
router.post('/login', auth.postlogin)

module.exports = router

const express = require('express')
const router = express.Router({mergeParams: true})
const vote = require('../controllers/Vote')

const isLoggedin =(req, res, next) =>{
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}


router.get('/votes', vote.index)

router.get('/votes/new', isLoggedin, vote.new)

router.post('/votes', vote.postvote)

router.get('/votes/:id', vote.show)

router.get('/votes/user', vote.byuser)

router.get('/votes/:id/delete', vote.deleteById)

router.post('/votes/:id/edit', vote.editById)

router.post('/votes/:id', vote.dataById)



module.exports = router

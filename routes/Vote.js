const express = require('express')
const router = express.Router({mergeParams: true})
const vote = require('../controllers/vote')

router.get('/votes', vote.index)

router.get('/votes/new', vote.new)

router.post('/votes', vote.postvote)

router.get('/votes/:id', vote.show)

router.get('/votes/user', vote.byuser)

router.get('/votes/:id/delete', vote.deleteById)

router.post('/votes/:id/edit', vote.editById)



module.exports = router

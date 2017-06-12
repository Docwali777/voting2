const express = require('express');
const voteData = require('../models/votingdata')


const vote = {}

vote.index = (req, res)=>{
  voteData.find({}, (err, options)=>{
    if(err){console.log(err);}
    else{

      console.log(options);
      res.render('votes/index', {
        options
      })
    }
  })
}

vote.new= (req, res)=>{
res.render('votes/new')
}


vote.deleteById = (req, res)=>{
  voteData.findByIdAndRemove(req.params.id, (err, options)=>{
    if(err){console.log('error deleting ITEM');}
    else {
      console.log('item deleteById')
      res.redirect('/votes')
    }
  })
}

vote.editById = (req, res)=>{
  console.log(req.body);
voteData.findById(req.params.id, (err, options)=>{
  if(err){console.log('error editing post by id: ', err);}
  else {
    options.options.select.push(req.body)
    options.save()
    console.log(`OPTIONS`,options.options.select);
      res.redirect(`/votes/${req.params.id}`)
  }
})

}

vote.postvote = (req, res)=>{
  console.log('new', req.body);
voteData.create({
  options: {
    title: req.body.title
  }
}, (err, options)=>{
  if(err)console.log('options not created');
  else {
    options.save()
    console.log('Vote saved', options);


  res.redirect('/votes')
  }
})
}

vote.show = (req, res)=>{
voteData.findById(req.params.id, (err, options)=>{
  if(err){console.log('err find id');}{
      res.render('votes/show', {
        options
      })
  }
})
}
vote.byuser = (req, res)=>{
  res.send('by user')
}



module.exports = vote

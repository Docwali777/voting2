const express = require('express');
const voteData = require('../models/votingdata')

const vote = {}

vote.index = (req, res) => {
  voteData.find({}, (err, options) => {
    if (err) {
      console.log(err);
    } else {

      console.log(options);
      res.render('votes/index', {options})
    }
  })
}

vote.new = (req, res) => {
  res.render('votes/new')
}

//submit data to create the graph with d3
vote.dataById = (req, res) => {
  voteData.findById(req.params.id, (err, options)=>{
    if(err){'cant post form'}


    options.options.data.sort()
    let {data} = options.options
for(let i = 0; i < data.length; i++){
if(data[i][0] === req.body.label){
data[i].push(req.body.label)
}

}

console.log('DATA',data);
    options.save()
        res.redirect(`/votes/${req.params.id}`)
  })


}

vote.deleteById = (req, res) => {
  voteData.findByIdAndRemove(req.params.id, (err, options) => {
    if (err) {
      console.log('error deleting ITEM');
    } else {
      console.log('item deleteById')
      res.redirect('/votes')
    }
  })
}

vote.editById = (req, res) => {
  voteData.findById(req.params.id, (err, options) => {
    if (err) {
      console.log('error editing post by id: ', err);
    } else {
      //ON=nyl add noew item if it is a new Item
      if (options.options.select.indexOf(req.body.select) < 0) {
        options.options.select.push(req.body.select)
         options.options.data.push([req.body.select])

 }

console.log('EDIT',  options.options.select);

      options.save((err, vote) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(`/votes/${req.params.id}`)
        }
      })

      // console.log(`OPTIONS`,options.options.select);
    }
  })

}

vote.postvote = (req, res) => {
  console.log('new', req.body);
  voteData.create({
    options: {
      title: req.body.title,
      created: new Date(),
      select: []
    }
  }, (err, options) => {
    if (err)
      console.log('options not created');
    else {
      options.save()

      res.redirect(`/votes/${options._id}`)
    }
  })
}

vote.show = (req, res) => {
  voteData.findById(req.params.id, (err, options) => {
    if (err) {
      console.log('err find id');
    }
    {
      res.render('votes/show', {options})
    }
  })
}
vote.byuser = (req, res) => {
  res.send('by user')
}

module.exports = vote

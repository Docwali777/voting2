const mongoose = require('mongoose');
let {Schema} = mongoose

const votingDataSchema = new Schema({
  options: {
    title: String,
    select: []
  }
})



module.exports = mongoose.model('Voting', votingDataSchema)

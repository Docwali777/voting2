const mongoose = require('mongoose');
let {Schema} = mongoose

const votingDataSchema = new Schema({
  title: String,
  options: Array
})



module.exports = mongoose.model('Voting', votingDataSchema)

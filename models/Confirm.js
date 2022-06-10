const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email: String,
    createdAt: Number,
    type: String,
    code: Number,
    confirmCode: {type: Boolean, default: false},
    token: String
})

module.exports = mongoose.model('Confirm', schema);
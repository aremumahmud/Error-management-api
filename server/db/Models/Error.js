const mongoose = require('mongoose')
const Schema = mongoose.Schema

let error = new Schema({
    err_type: {
        required: true,
        type: String
    },
    err_body: {
        required: true,
        type: {}
    },
    user: {
        required: true,
        type: String
    }
})


module.exports = mongoose.model('Error', error)
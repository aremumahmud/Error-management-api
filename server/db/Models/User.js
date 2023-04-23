const mongoose = require('mongoose')
const Schema = mongoose.Schema

let User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    errors: [{
        type: Schema.Types.ObjectId,
        ref: 'Error'
    }],
    password: String

})

module.exports = mongoose.model('User', User)
module.exports = mongoose.model('User', User)
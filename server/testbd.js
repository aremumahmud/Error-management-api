class db {
    constructor() {
        this.errors = {
            verbose_errors: {},
            undefined_operation_error: {},
            transport_error: {},
            create_user_error: {},
            sign_in_user_error: {},
            operation_error: {},
            dbconnect_error: {},
            authentication_error: {},
        }
    }

    put(data, type, call) {
        this.errors[type].push(data)
        process.nextTick(() => call())
    }
    retrieve(type, call) {
        process.nextTick(() => call(this.errors[type]))
    }
}


// const express = require('express')
// const app = express()
// const cors = require('cors')


// app.use(cors())
// app.get('/', (req, res) => {
//     res.end(`hello_tinnxxxtwilloxxxsengokuxxxrengoku`)
// })



// app.listen(2000, () => {
//     console.log('server started')
// })
module.exports = new db()
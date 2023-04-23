const mongoose = require('mongoose')
const Error = require('./Models/Error')
const User = require('./Models/User')
let uri = process.env.MONGOOSE_URI || 'mongodb://127.0.0.1:27017/testdb1'


let models = {
    error: Error
}
setTimeout(() => {
    uri = 'mongodb://127.0.0.1:27017/testdb1'
}, 20000);

let connect = ((m, th) => {
    console.log('starting....')
    mongoose.connect(uri).then(res => {
        th.isConnected = true
        th.retryAllOperations((d, j) => {
            console.log(d, j)
        }, 0)
        console.log('the database server has been connected successfuly')
    }).catch(err => {
        console.log('error connecting to database ')
        setTimeout(() => {
            connect(uri, th)
        }, 3000);

    })
})


class db {
    constructor(uri) {
        this.isConnected = false
        this.queue = []
        connect(uri, this)
    }

    retryOperation(operation, log, cb) {
        let { type, args, model } = operation
        let nn;
        if (type == 'save') {
            nn = new Error(args[0]).save().then(res => {
                res.error = false
                typeof cb == 'function' && process.nextTick(() => cb(res))
                if (log) {
                    console.log(res)
                }
            }).catch(e => {
                let err = {...operation }
                err.error = true
                typeof cb == 'function' && process.nextTick(() => cb(err))
                if (log) {
                    console.log(err)
                    this.queue
                }
            })
            return
        }
        console.log(nn)
        models[model][type].apply(models[model], ...args).then(res => {
            res.error = false
            typeof cb == 'function' && process.nextTick(() => cb(res))
            if (log) {
                console.log(res)
            }
        }).catch(e => {
            let err = {...operation }
            err.error = true
            typeof cb == 'function' && process.nextTick(() => cb(err))
            if (log) {
                console.log(err)
                this.queue
            }
        })
    }

    retryAllOperations(done, log = false) {
        console.log('ll')
        let pr = this.queue.map(operation => {
            return new Promise((resv, rej) => {
                this.retryOperation(operation, log, (res) => {
                    if (res.error) {
                        return rej(res)
                    }
                    resv(res)
                })
            })

        })

        Promise.all(pr).then(res => {
            typeof done == 'function' && process.nextTick(() => done(null, res))
        }).catch(errs => {
            typeof done == 'function' && process.nextTick(() => done(errs, null))
            setTimeout(() => {
                this.queue.concat(errs)
            }, 2000);
        })
    }

    saveError(error) {
        return new Promise((resolve, reject) => {

            if (!this.isConnected) {
                console.log('pushed to queue')
                this.queue.push({
                    type: 'save',
                    model: 'error',
                    args: [error]
                })
                return resolve({
                    error: false,
                    queued: true
                })
            }
            let err = new Error(error)
                .save()
                .then(res => {
                    resolve({
                        error: false,
                        queued: false,
                        final: res
                    })
                })
                .catch(err => {
                    reject({
                        error: true,
                        queued: false,
                        final: err
                    })
                })
        })
    }

    getAllRecords(name) {
        return new Promise((resolve, reject) => {
            Error.find({ user: name })
                .then(res => {
                    resolve({
                        error: false,
                        queued: false,
                        final: res
                    })
                })
                .catch(err => {
                    reject({
                        error: true,
                        queued: false,
                        final: err
                    })
                })
        })

    }
    createUser(email, username, password) {
        return new Promise((res, rej) => {
            let newUser = new User({
                username,
                email,
                password
            }).save().then(result => {
                res()
            }).catch(err => {
                rej(err)
            })
        })

    }

    findUserById(userId) {
        return new Promise((res, rej) => {

            User.findById(userId)
                .then(result => {
                    // console.log(result)
                    res(result)
                }).catch(err => {
                    console.log(err)
                    rej()
                })

        })
    }

    findUserByEmail(email) {
        return new Promise((res, rej) => {

            User.findOne({ email })
                .then(result => {
                    // console.log(result)
                    res(result)
                }).catch(err => {
                    console.log(err)
                    rej()
                })

        })
    }

}


let dbs = new db(uri)
module.exports = dbs
    // dbs.saveError({
    //         err_type: 'skibi badass',
    //         err_body: {
    //             lande: 'jksjmz',
    //             ksks: ';smjs'
    //         },
    //         user: 'cansy.co'
    //     })
    // dbs.retryOperation({
    //     model: 'error',
    //     args: [{ user: 'loander' }],
    //     type: 'findOne'
    // }, 1)
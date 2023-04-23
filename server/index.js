const controlM = require('../lib')
const sock = require('socket.io')
const schemes = require('./appSchema')

let db = require('./testbd')


let controlN = new controlM('localhost', 8000)

let control = controlN.createConnection('sourceSystem', (err, uu) => {
    console.log(err, uu)
})

const app = require('./expressApp')(control)
    // control system models operation

control
    .startServer(5000, app)
    .integrateSocketCommunucation(sock)
    .setActionSchemes(schemes)
    .on('error', (data) => {
        db.put(data, data.type, () => {
            control.broadcastToClients('error', data)
        })

    })
    .on('sysError', err => {
        console.log(err)
    })
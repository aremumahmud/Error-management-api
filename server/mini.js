var miniSystem = require('../@tcim_model/index')
var mini = new miniSystem.miniSystem()

mini
    .startOperation(8000, (onstart) => {
        console.log('system started')
    })
    .on('init', (data) => {
        mini.bindToQueue(data.msg, data.socket)
        mini.send(data.msg, 'connection sucessful', 'onconnect')
    })
    .on('sysError', err => {
        console.log(err)
    })
    .on('ErrorRecieve', (e) => {
        console.log('a verbose error', e.msg)
        control.broadcastToClients('ErrorList', e.msg)
    })

// setInterval(() => {
//         let id = new Date().toTimeString() + Math.random()
//         let error = {
//             err_type: 'verbose_errors',
//             err_body: {
//                 errBody: 'git for-each-ref --sort -committerdate --format %(refname) %(objectname) %(*objectname) [389ms]',
//                 errDate: '2022-11-22 14:54:07.192',
//                 _id: id
//             },
//             _id: id
//         }
//         control.send('sourceSystem', error, 'ErrorRecieve')
//     },
//     2000)
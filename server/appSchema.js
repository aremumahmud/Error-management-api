const db = require('./testbd')
module.exports = [{
    action: 'sendToMail',
    exec: (data, master) => {
        console.log('sent to mail bruv')
            //test object ...
        let res = {
            success: true
        }
        master.emiToClient(data._userId, 'mailedSucess', res)
    }
}, {
    action: 'ready',
    exec: (data, master) => {
        db.retrieve(data.type, (res) => {
            master.emiToClient(data._userId, 'loading', res)
        })

    }
}]
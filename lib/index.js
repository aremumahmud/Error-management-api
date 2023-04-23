const { controlSystem } = require("../@tcim_model")
const control = new controlSystem('master')

class ErrorManager {
    constructor(host, port, resetOptions = false) {
        this.host = host
        this.port = port
        this.resetOptions = resetOptions

    }

    createConnection(name, callback) {
        let reset, interval;
        if (this.resetOptions) {
            reset = true;
            interval = this.resetOptions
        }
        return control
            .addSystem(name, {
                port: this.port,
                host: this.host,
                name,
                resetOptions: reset,
                resetInterval: interval,
                onConnect: () => {
                    process.nextTick(() => callback(null, {
                        status: 200,
                        msg: 'connection was established'
                    }))
                },
                onError: () => {
                    process.nextTick(() => callback({
                        ststus: 400,
                        msg: 'connection failed'
                    }, null))
                }
            })
            .attachSystems()
    }
}

module.exports = ErrorManager
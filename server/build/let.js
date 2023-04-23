// function pullErrors(self) {

//     const socket = io('http://localhost:4000')
//     socket.on('connected', msg => {
//         if (!msg.jargons) {
//             self.setState({ done: false })
//         } else {
//             console.log('err occured durring connection')
//             self.setState({ done: false })
//         }

//     })
//     socket.on('ErrorList', msg => {
//         let category = msg.err_type
//         let errBody = msg.err_body
//         let states = Object.create(self.state[category])
//         console.log(states, 'kk')
//         states[msg._id + Math.random()] = errBody
//         self.setState({
//             [category]: states
//         })
//     })
//     return socket



//     //const self = this

// }

// window['pullErrors'] = pullErrors
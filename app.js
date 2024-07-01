const express    = require('express')
const cors       = require('cors')
const morgan     = require('morgan')
const bodyParser = require('body-parser')
const dotenv     = require("dotenv")
const router     = require('./src/routes/api')
const path = require('path')

const app = express()
const server = require('http').Server(app)
// const { createMessage } = require('./src/controllers/chatController')
dotenv.config()
const port = process.env.BACK_PORT || 5000

const corsOptions = {
  origin: '*',
}
const io = require('socket.io')(server,{ cors:corsOptions })

app
    .use(morgan('dev'))
    .use(cors(corsOptions))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended:true}))
    .use('/uploads',express.static(path.join(__dirname, '/src/uploads')))
    .use('/',router)

server.listen(port, () => {
    console.log(`server running on PORT : ${port}` )
})

const connectedUser = []

io.on('connection', (socket) => {
  console.log(socket.id + ' ==== connected')
  socket.on('status', status => {

    const existingUser = connectedUser.find((user) => user.username === status.username && user.id === status.id)
    
    if(!existingUser) connectedUser.push(status)

    socket.emit('connectedUser', connectedUser)
  })

  socket.on('join', roomName => {

      let split = roomName.split('--with--') // ['username2', 'username1']
      let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)) // ['username1', 'username2']
      let updatedRoomName = `${unique[0]}--with--${unique[1]}` // 'username1--with--username2'

      Array.from(socket.rooms)
            .filter(it => it !== socket.id)
            .forEach(id => {
              socket.leave(id)
              socket.removeAllListeners(`sendMessage`)
            })

      socket.join(updatedRoomName)

    socket.on(`sendMessage`, message => {
        Array.from(socket.rooms)
            .filter(it => it !== socket.id)
            .forEach(id => {
            
                // createMessage(message.UserId, message.msg, message.room)
                console.log('Rotsyyyyyyyyyyyyyyy')
                console.log(message)
                socket.to(id).emit('receiveMessage', {msg:message.msg, id: message.id, room : updatedRoomName})
            })
    })
  })

  socket.on('leave',(id)=>{
    const index  = connectedUser.findIndex((user) => user.id == id )
    if(index !== -1 ) connectedUser.splice(index, 1)[0]
    socket.emit('connectedUser', connectedUser)
  })

  socket.on('disconnect', () => {
    console.log(socket.id + ' ==== diconnected')
  })

   })
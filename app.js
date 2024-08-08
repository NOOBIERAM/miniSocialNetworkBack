const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
const router = require('./src/routes/api')
const path = require('path')

const app = express()
const server = require('http').Server(app)
// const { createMessage } = require('./src/controllers/chatController')
dotenv.config()
const port = process.env.BACK_PORT || 5000

const corsOptions = { origin: '*' }

const io = require('socket.io')(server, { cors: corsOptions })

app
  .use(morgan('dev'))
  .use(cors(corsOptions))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('/uploads', express.static(path.join(__dirname, '/src/uploads')))
  .use('/', router)

server.listen(port, () => {
  console.log(`server running on PORT : ${port}`)
})

const connectedUser = []

io.on('connection', (socket) => {
  const senderId = socket.handshake.query.senderId
  console.log('connect');
  socket.on('join', roomName => {
    console.log("azertyuiop   ",roomName.receiverId);
    const receiverId = roomName.receiverId
    const room = senderId < receiverId ? senderId + '-room-' + receiverId : receiverId + '-room-' + senderId

    Array.from(socket.rooms)
      .filter(it => it !== socket.id)
      .forEach(id => {
        socket.leave(id)
        socket.removeAllListeners(`sendMessage`)
      })

    socket.join(room)
    socket.on(`sendMessage`, message => {
      Array.from(socket.rooms)
        .filter(it => it !== socket.id)
        .forEach(id => {

          // createMessage(message.UserId, message.msg, message.room)
          console.log('Rotsyyyyyyyyyyyyyyy')
          console.log("message == ",message.message)
          console.log("id == ", id);
          socket.to(id).emit('receiveMessage', "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")// qui charge de la reenvoye du message 
        })
    })
  })
  socket.on('newPost',(data)=>{
    console.log(data);
    io.emit('notifyPost',"data")
  })
  socket.on('newFriend',(data)=>{
    io.emit('notifyFriend',"data")
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
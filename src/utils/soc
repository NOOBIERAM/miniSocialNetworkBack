import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}
  
    setupSocketConnection() { //created
      this.socket = io('http://127.0.0.1:3000');
    }
    joinRoom(id, anotherID){
      this.socket.emit('join', `${id}--with--${anotherID}`)
    }
    getMessages(msg, messages){
       this.socket.on('message',(msg) => {
          messages.push(msg)
        })
    }
    sendMessage(msg)
    {
      if(!msg) return
      this.socket.emit('sendMessage', msg)
    }
    disconnect() { //beforeUnmount
        if (this.socket) {
            this.socket.disconnect();
        }
    }
  }
  
  export default new SocketioService();

  // this.messages = [...this.messages, data];
            // you can also do this.messages.push(data)
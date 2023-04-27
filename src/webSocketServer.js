const { Server } = require('socket.io');
const mongoose = require('mongoose');
const mongoDbChatsManager = require('./dao/mongoDB/mongoChatManager');


const mongoChatManager = new mongoDbChatsManager();

/*Configuracion y logica del servidor websocket
La funcion createWebSocketServer se exporta a app.js y toma como parametro la configuracion del servidor http*/ 
let messages = [];

const createWebSocketServer = (httpServer) => {

  const webSocketServer = new Server(httpServer);
  
  webSocketServer.on('connection', socket => {
      socket.emit('message', 'Hola!!')
      socket.on('message2', data => {
          if (data) {
              socket.emit('message2', console.log(data))
            }
          })
         
      socket.on('newProduct', data => {
        console.log(data);
        webSocketServer.emit('newProduct', data )
      })

      /*chat*/
      socket.on('newChatMessage', data => {
        messages.push(data);
       webSocketServer.emit('messageLogs', messages);

       /* guarda el mensaje emitido desde la base de datos*/
            mongoChatManager.saveMessage(data).then(cb => { return console.log( {
                                                                    status: 'success', 
                                                                    message: `message saved succesfully, ${cb}`
                                                                   })
                                                           })
                                                           .catch(e => {
                                                                       console.error(e.message);
                                                                       });
                                          });
});

  return webSocketServer
}

module.exports = createWebSocketServer;

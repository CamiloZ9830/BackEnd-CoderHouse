const { Server } = require('socket.io');

/*Configuracion y logica del servidor websocket
La funcion createWebSocketServer se exporta a app.js y toma como parametro la configuracion del servidor http*/ 

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
        socket.emit('newProduct', data )
      })

  });

  return webSocketServer
}

module.exports = createWebSocketServer;

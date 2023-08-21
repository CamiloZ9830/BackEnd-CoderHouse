const { Server } = require('socket.io');
const mongoDbChatsManager = require('./dao/mongoDao/mongoChatDao');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('./config/dotenvVariables.config')



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

      /*send user email*/
     const cookie = socket.handshake.headers.cookie;
     //console.log("extracted token: ", cookie.split('=')[1]);
     const token = extractTokenFromCookie(cookie);

     if (!token) {
      console.error('JWT token not found in the cookie. Please Try again!');
      return;
    }
   
  

    try {
      const decoded = jwt.verify(token, jwtKey);
      const userData = decoded.user;
      socket.emit('user', userData);
    } catch (err) {
      console.error('Invalid JWT token:', err.message);
    }
  

  

      /*chat*/
      socket.on('newChatMessage', data => {
        messages.push(data);
       webSocketServer.emit('messageLogs', messages);

       /* guarda el mensaje emitido a la base de datos*/
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
function extractTokenFromCookie(cookieHeader) {
  if (!cookieHeader) {
    return null;
  }

  const tokenRegex = /jwtCookieToken=([^;]+)/;
  const match = cookieHeader.match(tokenRegex);
  if (match) {
    console.log(match[1]);
    return match[1];
  }
  return null;
}

module.exports = createWebSocketServer;

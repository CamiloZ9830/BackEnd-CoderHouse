const socket = io();

/*products websocket server*/
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('message', data => {
  console.log(data);
});

/*mensaje emitido al servidor cada vez que se conecta un nuevo cliente*/ 
socket.emit('message2', 'cliente conectado');

/*mensaje recibido del servidor cada vez que se agrega un producto por POST o se elimina por DELETE y recibe el payload del array de productos actualizado*/ 
socket.on('newProduct', product => {
  if (typeof product === 'object') {
    console.log('updated: enviado desde websocket ', product);
  }
})
socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});


/*chat websocket*/
let user;
let chatBox = document.getElementById('input-chat');

/*traer user, email y username*/
socket.on('user', data => {
    user = {
        email: data.email,
        userName: data.userName
    }
    return user;
})

chatBox.addEventListener('keyup', evt => {
  if(evt.key === "Enter") {
    if(chatBox.value.trim().length > 0) {
         socket.emit('newChatMessage', {
                                      user: user.email ? user.email : user.userName,
                                      message: chatBox.value
                                     })
      chatBox.value = "";
    }
  }
});


/*socket listener del chat*/

socket.on('messageLogs', data => {
  let log = document.getElementById('chat-messages')
  let messages = "";
  data.forEach(message => {
    messages = messages + `${message.user} dice: ${message.message}</br>`
  })
  log.innerHTML = messages;
});




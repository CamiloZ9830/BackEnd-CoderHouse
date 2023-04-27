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


/*chat websocket server*/
let user;
const emailRegex = /\S+@\S+\.\S+/;
let chatBox = document.getElementById('input-chat');

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa tu correo para empezar a chatear",
  inputValidator: (value) => {
         if (!value) return 'Necesitas escribir un correo para continuar';
         else if (!emailRegex.test(value)) return 'Patron de email no valido'
  },
  allowOutsideClick: false
 
}).then(result => {
    user = result.value
});

chatBox.addEventListener('keyup', evt => {
  if(evt.key === "Enter") {
    if(chatBox.value.trim().length > 0) {
         socket.emit('newChatMessage', {
                                      user: user,
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




const socket = io();

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


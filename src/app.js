const express = require('express');
const app = express();
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/sessions.router');
const createWebSocketServer = require('./webSocketServer');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const mongoose = require('mongoose');
const initializePassport = require('./config/passport.config');
const passport = require('passport');



const httpServer = app.listen(8080, () => {
console.log('Server is listening on port 8080...');
}); 

/*Servidor websocket instanciado con la configuracion del servidor http de express*/
const webSocketServer = createWebSocketServer(httpServer);
/*Encerre toda las rutas de products.router en una funcion llamada returnRouter que tiene como parametro la configuracion del servidor websocket y poder usar las operaciones http*/
const productsRouter = require('./routes/products.router')(webSocketServer);

/*connexion a mongoDB*/
const uri = 'mongodb+srv://juanzora:JnzR43GjwHnIfd42@cluster1store.qiis50v.mongodb.net/?retryWrites=true&w=majority';
connect = async () => {
    try {
      mongoose.connect(uri, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      }); 
       console.log('Connected to MongoDB Atlas', mongoose.connection.readyState);
      
     }
    catch (e) {
      console.error(e.message);
        process.exit();
       }
  };

 connect();
 
 /*Configuracion de Handlebars*/
 app.engine('handlebars', handlebars.engine());
 app.set('views', __dirname + '/views');
 app.set('view engine', 'handlebars');
 
 /*static-path */
 app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
/*cookie parser */
app.use(cookieParser());

/*Manager de sesion*/
app.use(session({
  store: MongoStore.create({
    mongoUrl: uri,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
      },
      ttl: 300
  }),
  secret: "itsasecret",
  resave: true,
  saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

/*rutas */
app.use('/', productsRouter);
app.use('/', cartsRouter);
app.use('/', viewsRouter);
app.use('/', usersRouter);






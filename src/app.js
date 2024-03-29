const express = require('express');
const app = express();
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/sessions.router');
const createWebSocketServer = require('./webSocketServer');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const initializePassport = require('./config/passport.config');
const passport = require('passport');
const MongoSingleton = require('./database/MongoDb');
const { port } = require('./config/dotenvVariables.config');
const { errorHandler } = require('./middlewares/router.middlewares/error.middlewares');
const { winstonLogger, errorHandlerLogger } = require('./utils/logger/logger.utils');
const { swaggerOptions } = require('../docs/swagger.config');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const { inactiveUsersCleanup } = require('./utils/scheduleTasks');

/*winston logger*/
app.use(winstonLogger);
app.use(errorHandlerLogger);

const httpServer = app.listen(port, () => {
console.log(`Server is listening on port ${port}...`);
}); 

/*Servidor websocket instanciado con la configuracion del servidor http de express*/
const webSocketServer = createWebSocketServer(httpServer);
/*Encerre toda las rutas de products.router en una funcion llamada returnRouter que tiene como parametro la configuracion del servidor websocket y poder usar las operaciones http*/
const productsRouter = require('./routes/products.router')(webSocketServer);

/*conexion a mongoDB*/
MongoSingleton.getInstance();

/*inactive users clean up*/
inactiveUsersCleanup();

 
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


initializePassport();
app.use(passport.initialize());

/*swagger config documentation*/
const specs = swaggerJSDoc(swaggerOptions);


/*rutas */
app.use('/docs/', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('/', productsRouter);
app.use('/', cartsRouter);
app.use('/', viewsRouter);
app.use('/', usersRouter);

/* error handler */
app.use(errorHandler);






const express = require('express');
const productsRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(express.static(__dirname + '/public'));


app.use('/', productsRouter);
app.use('/', cartsRouter);


app.listen(5000, () => {
    console.log('Server is listening on port 5000...');
}) 



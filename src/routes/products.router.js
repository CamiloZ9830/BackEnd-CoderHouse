const { Router } = require('express');
const router = Router();
const path = require('path');
const passport = require('passport');
const ProductsController = require('../controllers/products.controller');
const { objectValidation, objectValidationUpdate } = require('../middlewares/router.middlewares/router.middlewares');

const productsController = new ProductsController();
  /*const filePath = path.resolve(__dirname, '../dao/fsDao/products-file.json');
  const callNewProduct = new ProductManager(filePath);*/
  
  
  const returnRouter = function(io) {

  router.get('/api/products/',  passport.authenticate('jwt', {session: false}), async (req, res) => {
     /*getDbProducts ? res.status(200).send({status: 'success', payload: getDbProducts})
     : res.status(400).send({status: 'error', payload: getDbProducts});*/
  });
  
  
  router.get('/api/products/:pid', productsController.findProductById, async (req, res) => {              
    });
  
    
  
  
   router.post('/api/products/', objectValidation, productsController.addProduct, async (req, res) => {
            //io.sockets.emit('newProduct', [prod2, allProducts]);         
      });
      
     
  
  
   router.put('/api/products/:pid/', objectValidationUpdate, productsController.updateProductById, async (req, res) => {   
   });
  
  
   router.delete('/api/products/:pid/', productsController.deleteProductById, async (req, res) => {   
             //io.sockets.emit('newProduct', {status: "success", massage: `product with pid ${pid} deleted`, payload: allProducts});     
   });
     return router

  }


 module.exports = returnRouter;
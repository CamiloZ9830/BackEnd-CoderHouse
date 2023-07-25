const { Router } = require('express');
const router = Router();
const path = require('path');
const ProductsController = require('../controllers/products.controller');
const { objectValidation, objectValidationUpdate, ownerDeleteProduct } = require('../middlewares/router.middlewares/router.middlewares');
const { handlePermissions, passportCall } = require('../utils/authorization.utils');

const productsController = new ProductsController();
  /*const filePath = path.resolve(__dirname, '../dao/fsDao/products-file.json');
  const callNewProduct = new ProductManager(filePath);*/
  
  
  const returnRouter = function(io) {

  router.get('/api/products/',productsController.getProducts, async (req, res) => {
     /*getDbProducts ? res.status(200).send({status: 'success', payload: getDbProducts})
     : res.status(400).send({status: 'error', payload: getDbProducts});*/
  });

  /*ruta de mocking products*/
  router.get('/mockingproducts', productsController.mockingProducts);
  
  
  router.get('/api/products/:pid', productsController.findProductById);
  
  
   router.post('/api/products/', passportCall('jwt'), handlePermissions(["PREMIUM", "ADMIN"]),
                  productsController.createProduct, 
                  async (req, res) => {
            //io.sockets.emit('newProduct', [prod2, allProducts]);         
      });
      
     
  
   router.put('/api/products/:pid/',passportCall('jwt'), handlePermissions(["ADMIN"]), objectValidationUpdate, productsController.updateProductById, async (req, res) => {   
   });
  
  
   router.delete('/api/products/:pid/',passportCall('jwt'), handlePermissions(["PREMIUM", "ADMIN"]), ownerDeleteProduct, productsController.deleteProductById, async (req, res) => { 
      console.log("success");  
             //io.sockets.emit('newProduct', {status: "success", massage: `product with pid ${pid} deleted`, payload: allProducts});     
   });
     return router

  }


 module.exports = returnRouter;
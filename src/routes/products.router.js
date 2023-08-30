const { Router } = require('express');
const router = Router();
const ProductsController = require('../controllers/products.controller');
const { objectValidation, objectValidationUpdate, ownerDeleteProduct } = require('../middlewares/router.middlewares/router.middlewares');
const { handlePermissions, passportCall } = require('../utils/authorization.utils');

const productsController = new ProductsController();
  
  const returnRouter = function(io) {

  router.get('/api/products/',productsController.getProducts);

  /*ruta de mocking products*/
  router.get('/mockingproducts', productsController.mockingProducts);
  
  /*encuentra un producto por id*/
  router.get('/api/products/:pid', productsController.findProductById);
  
  /*crea un producto*/
   router.post('/api/products/', passportCall('jwt'), productsController.createProduct);
      
     
  /*actualiza producto*/
   router.put('/api/products/:pid/',passportCall('jwt'), handlePermissions(["ADMIN"]), 
               objectValidationUpdate, productsController.updateProductById);
  
  /*elimina un producto */
   router.delete('/api/products/:pid/', productsController.deleteProductById, async (req, res) => { 
      console.log("success");      
   });

   /*test y docs routes*/
   router.post('/api/products-test/', productsController.swaggerCreateProduct);
   router.delete('/api/products-test/:pid/', productsController.testDeleteProductById);
     return router

  }


 module.exports = returnRouter;
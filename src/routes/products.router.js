const { Router } = require('express');
const ProductManager = require('../dao/fs/ProductManager');
const router = Router();
const path = require('path');
const mongoDBProductsManager = require('../dao/mongoDB/mongoProductManager');
const passport = require('passport');


  const filePath = path.resolve(__dirname, '../dao/fs/products-file.json');
  const callNewProduct = new ProductManager(filePath);

  const mongoProductManager = new mongoDBProductsManager();
  
  
  const returnRouter = function(io) {

  router.get('/api/products/',  passport.authenticate('jwt', {session: false}), async (req, res) => {
    //const products =  await callNewProduct.getProducts(); 
    //res.status(200).send({status: 'success', payload: getDbProducts}); 
    //const prod = products.slice(0, Number(limit)); 
    try {
      const limit = req.query.limit || 8;
      let page = parseInt(req.query.page) || 1;
      const category = req.query.category || {};
      const sort = req.query.sort || {};
      
  if (isNaN(page) || page <= 0) {
      page = 1;
    }
      const getDbProducts = await mongoProductManager.getProducts(Number(limit), page, category, sort);
      const { hasNextPage, hasPrevPage, nextPage, prevPage } = getDbProducts;
      const products1 = "http://localhost:8080/api/products";

      /*objeto agrega "nextLink" y "prevLink"  */
      /*para la vista de productos se usa la direccion /products que esta en views.router */
      hasNextPage ? getDbProducts["nextLink"] = `${products1}?page=${nextPage}`
      : getDbProducts["nextLink"] = null;
      hasPrevPage ? getDbProducts["prevLink"] = `${products1}?page=${prevPage}` 
      : getDbProducts["prevLink"] = null;

     getDbProducts ? res.status(200).send({status: 'success', payload: getDbProducts})
     : res.status(400).send({status: 'error', payload: getDbProducts});
  }

  catch (e) {
      res.status(500).json({message: `Error: ${e.message}`});
  }     
  });
  
  
  router.get('/api/products/:pid', async (req, res) => {
                  try {
                    //const products =  await callNewProduct.getProducts();
                    const { pid } = req.params;         
                    //const findProd = products.find(item => item.id === Number(pid));
                    const findProduct = await mongoProductManager.findProductById(pid);
                      
                     if (findProduct) {
                       res.status(200).send({status: 'success', payload: findProduct});
                     }
    
                      else {
                          res.status(404).send({status: 'error', message: `Product with number ID ${pid} was not found`});
                        }
                  }
  
                  catch (e) {
                      res.status(500).json({message: e.message})
                  }
    });
  
    const objectValidation = (req, res, next) => {
      const product = req.body;
      const requiredAttrs = ['title', 'description', 'price', 'thumbnail', 'code', 'stock', 'category'];
      const isValid = requiredAttrs.every(attr => product.hasOwnProperty(attr) && product[attr]);
    
      if (isValid) {
        next();
        return
      } else {
        res.status(404).send('Invalid product object');
      }
    };
  
    const objectValidationUpdate = (req, res, next) => {
    
      const product = req.body;
      const requiredAttrs = ['title', 'description', 'price', 'thumbnail', 'code', 'stock', 'status', 'category'];
      const validAttrs = Object.keys(product).every(attr => requiredAttrs.includes(attr));
      const isValid = validAttrs && requiredAttrs.every(attr => !product.hasOwnProperty(attr) || product[attr] !== null);
    
      if (isValid) {
        
        Object.keys(product).forEach(key => {
          if (product[key] === null) {
            delete product[key];
          }
        });
    
        req.body = product;
        next();
        return;
      } else {
        res.status(404).send('Invalid attribute(s) in object');
      }
    };
  
  
   router.post('/api/products/', objectValidation, async (req, res) => {
            try {
              const product = req.body;
              //const prod2 = await callNewProduct.addProduct(product);
              //const allProducts = await callNewProduct.getProducts();
              const newProduct = await mongoProductManager.addProduct(product);             
              //io.sockets.emit('newProduct', [prod2, allProducts]);
              res.status(201).send({ status: 'success', payload: newProduct});
              }           
              catch (e) {
                    res.status(500).json({message: e.message})
              }
              
      });
      
     
  
  
   router.put('/api/products/:pid/', objectValidationUpdate, async (req, res) => {
              try {
                const { pid } = req.params;
                const product = req.body;             
                 //const updatedProduct = await callNewProduct.updateProductById(Number(pid), product);
                     const updatedProduct = await mongoProductManager.updateProductById(pid, product);
                  res.status(201).send({status: 'success', payload: updatedProduct});
              }
  
              catch (e) {
                    res.status(500).json({message: e.message}) 
              }     
   });
  
  
   router.delete('/api/products/:pid/', async (req, res) => {
         try {
           const {pid} = req.params;          
             //await callNewProduct.deleteProductById(Number(pid));
             //const allProducts = await callNewProduct.getProducts();
             const deleteProductById = await mongoProductManager.deleteProduct(pid);             
             res.status(200).send({status: 'success', message: deleteProductById});
             //io.sockets.emit('newProduct', {status: "success", massage: `product with pid ${pid} deleted`, payload: allProducts});
         }
  
         catch (e) {
              res.status(500).json({message: e.message});  
         }
            
         
   });
     return router

  }


 module.exports = returnRouter;
const { Router } = require('express');
const ProductManager = require('../ProductManager');
const router = Router();
const path = require('path');


  const filePath = path.resolve(__dirname, '../products-file.json');
  const callNewProduct = new ProductManager(filePath);
  
  
  const returnRouter = function(io) {

  router.get('/api/products/', async (req, res) => {
     try {
         const products =  await callNewProduct.getProducts(); 
           const { limit } = req.query;
  
                 if (limit) {
                      const prod = products.slice(0, Number(limit));
  
                       const prod2 = prod.map((item) => {
          
                       return item;
                  })
                       res.status(200).send({status: 'success', payload: prod2});   
                   }
  
             else {
                  const prod2 = products.map((item) => {
          
                   return item;
  
                  })
                      res.status(200).send({status: 'success', payload: prod2});
                  }
           } 
  
           catch (e) {
                  res.status(500).json({message: "Error"})
           }
      
  
  });
  
  
  router.get('/api/products/:pid', async (req, res) => {
                  try {
                    const products =  await callNewProduct.getProducts();
            
                    const { pid } = req.params;
          
                    const findProd = products.find(item => item.id === Number(pid));
                     if (findProd) {
            
                    res.status(200).send({status: 'success', payload: findProd});
                     }
    
                    else {
                         res.status(404).send({status: 'failed', message: `Product with number ID ${pid} is not found`});
                      }
                  }
  
                  catch (e) {
                      res.status(500).json({message: "Error"})
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
        res.status(400).send('Invalid product object');
      }
    };
  
    const objectValidationUpdate = (req, res, next) => {
    
      const product = req.body;
      const requiredAttrs = ['title', 'description', 'price', 'thumbnail', 'code', 'stock', 'status1', 'category'];
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
        res.status(400).send('Invalid attribute(s) in object');
      }
    };
  
  
   router.post('/api/products/', objectValidation, async (req, res) => {
            try {
              const product = req.body;
              const prod2 = await callNewProduct.addProduct(product);
              const allProducts = await callNewProduct.getProducts();
        
              io.sockets.emit('newProduct', [prod2, allProducts]);
              res.status(200).send({ status: 'success', payload: prod2});
              }
            
              catch (e) {
                    res.status(500).json({message: "Error"})
              }
              
      });
      
     
  
  
   router.put('/api/products/:pid/', objectValidationUpdate, async (req, res) => {
              try {
                const { pid } = req.params;
                const product = req.body;
              
                 const updatedProduct = await callNewProduct.updateProductById(Number(pid), product);
            
                  res.status(202).send({status: 'success', payload: updatedProduct});
              }
  
              catch (e) {
                    res.status(500).json({message: "Error"}) 
              }
               
           
   });
  
  
   router.delete('/api/products/:pid/', async (req, res) => {
         try {
           const {pid} = req.params;
           
             await callNewProduct.deleteProductById(Number(pid));
             const allProducts = await callNewProduct.getProducts();
             
             res.status(200).send({status: 'success', message: `Product with number ID ${pid} has been deleted`});
             io.sockets.emit('newProduct', {status: "success", massage: `product with pid ${pid} deleted`, payload: allProducts});
         }
  
         catch (e) {
              res.status(500).json({message: "Error"})  
         }
            
         
   });
   return router

  }


 module.exports = returnRouter;
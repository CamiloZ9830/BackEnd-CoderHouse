const { Router } = require('express');
const CartsManager = require('../dao/fs/CartsManager');
const ProductManager = require('../dao/fs/ProductManager');
const router = Router();
const path = require('path');
const mongoDbCartsManager = require('../dao/mongoDB/mongoCartsManager');


const filePath = path.resolve(__dirname, '../dao/fs/carts-file.json');
const callCart = new CartsManager(filePath);
const filePathP = path.resolve(__dirname, '../dao/fs/products-file.json');
const callProducts = new ProductManager(filePathP);

const mongoCartsManager = new mongoDbCartsManager();


router.post('/api/carts/', async (req, res) => {
        try {
                //const newCart = await callCart.addCart();
                
                const saveCart = await mongoCartsManager.addCart();

                res.status(201).send({status: 'success', payload: saveCart});
        }
        catch (e) {
                res.status(500).json({message: e.message});
        }
        
});


router.get('/api/carts/:cid/', async (req, res) => {
        try {
              const {cid} = req.params;

                //const cart = await callCart.getCartProductById(Number(cid));
                const getCartPopulate = await mongoCartsManager.getCartByIdPopulate(cid);
         
                getCartPopulate ? res.status(200).send({status: 'success', payload: getCartPopulate})
                : res.status(404).send({status: 'error', message: 'Resource Not Found'});
        }
        catch (e) {
                res.status(500).json({message: e.message});
        }
       
});

router.put('/api/carts/:cid', async (req, res) => {
        try{
                const { cid } = req.params;
                const newArrayProd = req.body;
                console.log(cid, newArrayProd);

                if (Array.isArray(newArrayProd) ) {
                      const updateCart = await mongoCartsManager.addNewArrayOfProducts(cid, newArrayProd);
                      updateCart ? res.status(200).send({status: 'success', payload: updateCart})
                      : res.status(404).send({status: 'error', message: 'Resource not found'});
                };

        }

        catch (e) {
                res.status(500).json({message: e.message});
        }
});


/*const invalidProductId = async (req, res, next) => {
             try {
                 const { pid } = req.params;
                     const findProd = await callProducts.getProductById(Number(pid));
                     if (findProd) {
                            next();
                            return 
                     }
                     else {
                            res.status(400).send('Product id doesnt exist');
                     }
             }

             catch (e) {
                res.status(500).send({message: e.message})
             }
};*/


router.post('/api/carts/:cid/product/:pid/',  async (req, res) => {
       try {
        const {cid, pid} = req.params;

        //const addProd = await callCart.addCartProductId(Number(cid), Number(pid));
        const addProductId = await mongoCartsManager.addProductId(cid, pid);

        addProductId ? res.status(201).send({status: 'success', payload: addProductId}) 
        : res.status(404).send({status: 'error', message: 'Resource Not Found'});
       }
       catch (e) {
               res.status(500).json({message: e.message});
       }
});

router.put('/api/carts/:cid/product/:pid/', async (req, res) => {
        try {
                const { quantity } = req.body;
                   const { cid, pid } = req.params;

                    if (quantity > 0 && quantity < 11) {

                            //const quantityUpdate =  await callCart.updateProdQuantity(Number(cid), Number(pid), quantity);
                            const updateProdQuantity = await mongoCartsManager.addProductQuantity(cid, pid, quantity);
    
                              updateProdQuantity ? res.status(201).send({status: 'success', payload: updateProdQuantity})
                              : res.status(404).send({status: 'error', message: 'Resource Not Found' });
                    }
                    else {
                        res.status(500).send(`Value too high or too low to update`);
                    }              
        }   
        catch (e) {
                res.status(500).json({message: e.message});
        }
});

/*const findCartProductId = async (req, res, next) => {
        try {
           const { cid, pid } = req.params;
           const findProd = await callCart.findProductId(Number(cid), Number(pid));
           if (typeof findProd == 'number' && findProd > -1) {
                next();
                return
           }
           else {
                res.status(404).send(`Cannot delete because product id number ${pid} doesnt exist in this cart`);
           }

        }

        catch (e) {
                res.status(500).send({message: e.message});
        }
};*/

router.delete('/api/carts/:cid/product/:pid/',  async (req, res) => {
         try {
                const { cid, pid } = req.params;
                //const deleteProd = await callCart.DeleteCartProductById(Number(cid), Number(pid));
                const deleteProd = await mongoCartsManager.deleteProductId(cid, pid);

                deleteProd ? res.status(200).send({status: 'success', payload: deleteProd})
                : res.status(404).send({status: 'error', message: 'Resource Not Found' });
         }

         catch (e) {
                res.status(500).json({message: e.message});
         }

});


router.delete('/api/carts/:cid',  async (req, res) => {
        try {
               const { cid } = req.params;
               const deleteProd = await mongoCartsManager.deleteAllProducts(cid);

              deleteProd ? res.status(200).send({status: 'success', payload: deleteProd})
              : res.status(404).send({status: 'error', message: 'Resource Not Found' });
        }

        catch (e) {
               res.status(500).json({message: e.message});
        }

});






module.exports = router;
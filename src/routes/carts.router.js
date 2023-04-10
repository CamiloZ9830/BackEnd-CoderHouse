const { Router } = require('express');
const CartsManager = require('../CartsManager');
const ProductManager = require('../ProductManager');
const router = Router();
const path = require('path');

const filePath = path.resolve(__dirname, '../carts-file.json');
const callCart = new CartsManager(filePath);
const filePathP = path.resolve(__dirname, '../products-file.json');
const callProducts = new ProductManager(filePathP);



router.post('/api/carts/', async (req, res) => {
        try {
                const newCart = await callCart.addCart();

                res.status(200).send({status: 'success', payload: newCart});
        }
        catch (e) {
                res.status(500).json({message: "Error"});
        }
        
});


router.get('/api/carts/:cid/', async (req, res) => {
        try {
              const {cid} = req.params;

                const cart = await callCart.getCartProductById(Number(cid));
         
                res.status(200).send({status: 'success', payload: cart});
        }
        catch (e) {
                res.status(500).json({message: "Error"});
        }
       
});


const invalidProductId = async (req, res, next) => {
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
                res.status(500).send('Error:', e)
             }
        

};


router.post('/api/carts/:cid/product/:pid/', invalidProductId, async (req, res) => {
       try {
        const {cid, pid} = req.params;

        const addProd = await callCart.addCartProductId(Number(cid), Number(pid));

        res.status(200).send({status: 'success', payload: addProd});
       }
       catch (e) {
               res.status(500).json({message: "Error", error: {e}});
       }
        

});

router.put('/api/carts/:cid/product/:pid/', invalidProductId, async (req, res) => {
        try {
                const { quantity } = req.body;
                   const { cid, pid } = req.params;

                        const quantityUpdate =  await callCart.updateProdQuantity(Number(cid), Number(pid), quantity);

                          res.status(200).send(quantityUpdate);
              
        }   

        catch (e) {
                res.status(500).json({message: "Error", error: {e}});
        }





});

const findCartProductId = async (req, res, next) => {
        try {
           const { cid, pid } = req.params;
           const findProd = await callCart.findProductId(Number(cid), Number(pid));
           if (typeof findProd == 'number' && findProd > -1) {
                next();
                return
           }
           else {
                res.status(400).send(`Cannot delete because product id number ${pid} doesnt exist in this cart`);
           }

        }

        catch (e) {
                res.status(500).send('Error:', e)
        }

          

};

router.delete('/api/carts/:cid/product/:pid/', invalidProductId, findCartProductId, async (req, res) => {
         try {
                const { cid, pid } = req.params;
                const deleteProd = await callCart.DeleteCartProductById(Number(cid), Number(pid));

                res.status(200).send({status: 'success', payload: deleteProd})
         }

         catch (e) {
                res.status(500).json({message: "Error", error: {e}});
         }

});






module.exports = router;
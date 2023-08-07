const { Router } = require('express');
const router = Router();
const path = require('path');
const CartController = require('../controllers/cart.controller');
const { ownerValidate, ownerValidatePostman } = require('../middlewares/router.middlewares/router.middlewares');
const { passportCall, handlePermissions } = require('../utils/authorization.utils');

const cartController = new CartController();

/*const filePath = path.resolve(__dirname, '../dao/fsDao/carts-file.json');
const callCart = new CartsManager(filePath);
const filePathP = path.resolve(__dirname, '../dao/fsDao/products-file.json');
const callProducts = new ProductManager(filePathP);*/

router.post('/api/carts/:cid/purchase', cartController.purchaseOrder);

router.post('/api/carts/', cartController.addCart);

router.get('/api/carts/:cid/', cartController.getCartById);

//router.get('/api/carts/:cid/', cartController.getCartByIdPopulate);

router.put('/api/carts/:cid', cartController.arrayOfProducts);

router.post('/api/carts/:cid/product/:pid/', cartController.addProductId);

router.put('/api/carts/:cid/product/:pid/', cartController.addQuantity);

router.delete('/api/carts/:cid/product/:pid/', cartController.deleteProductId);

router.delete('/api/carts/:cid', cartController.deleteAll);

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

module.exports = router;
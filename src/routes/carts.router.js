const { Router } = require('express');
const router = Router();
const CartController = require('../controllers/cart.controller');
const { ownerValidate, ownerValidatePostman } = require('../middlewares/router.middlewares/router.middlewares');
const { passportCall, handlePermissions } = require('../utils/authorization.utils');

const cartController = new CartController();

router.post('/api/carts/:cid/purchase', cartController.purchaseOrder);

router.post('/api/carts/', cartController.addCart);

router.get('/api/carts/:cid/', cartController.getCartById);

//router.get('/api/carts/:cid/', cartController.getCartByIdPopulate);

router.put('/api/carts/:cid', cartController.arrayOfProducts);

router.post('/api/carts/:cid/product/:pid/', cartController.addProductId);

router.put('/api/carts/:cid/product/:pid/', cartController.addQuantity);

router.delete('/api/carts/:cid/product/:pid/', cartController.deleteProductId);

router.delete('/api/carts/:cid', cartController.deleteAll);

module.exports = router;
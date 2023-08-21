const { Router } = require('express');
//const ProductManager = require('../dao/fsDao/ProductManager');
const router = Router();
const ProductsController = require('../controllers/products.controller');
const CartController = require('../controllers/cart.controller');
const { passportCall, handlePermissions } = require('../utils/authorization.utils');
const handlebarsHelpers = require('../views/handlebars.helpers/helpers'); 
const { ownerValidate, ownerDeleteProduct } = require('../middlewares/router.middlewares/router.middlewares');

const productsController = new ProductsController();
const cartController = new CartController();
//const filePath = path.resolve(__dirname, '../dao/fsDao/products-file.json');
//const callNewProduct = new ProductManager(filePath);



router.get('/', async (req, res) => {
    try {
        res.redirect('login');
    }
    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
});


router.get('/realTimeProducts', passportCall('jwt'), handlePermissions(["ADMIN"]), async (req, res) => {
    try {
        
        const getProducts = await callNewProduct.getProducts();
     
          res.render('realTimeProducts', {getProducts});
     
    }
    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
    
});


router.get('/realTimeChat', passportCall('jwt'), handlePermissions(["USER", "PREMIUM"]), async (req, res) => {
    try {
        const user = {email: req.user.email, userName: req.user.userName}

          res.render('chat', {user: user});
     
    }
    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
});



/* se usas queries como limit, page, product category (RoadBikes, ElectricBikes, accesorios etc.) y sort */
router.get('/products', passportCall('jwt'), productsController.getProductsRender);

/*Esta ruta renderiza los productos del carrito de un suario por id de carrito */
router.get('/carts/:cid/', passportCall('jwt'), cartController.getCartByIdPopulate);

/*ruta de handlebars view para agregar un producto al carrito de un usuario logueado con la estrategia jwt */
router.post('/carts/:cid/product/:pid', passportCall('jwt'), ownerValidate, cartController.addProductId);

router.post('/carts/:cid/remove-product/:pid', passportCall('jwt'), cartController.deleteFromCart);

router.post('/carts/:cid/purchase', passportCall('jwt'), cartController.purchaseOrder);


router.get('/register', async (req, res) => {
    try {
        res.render('register', {});
    }catch (e) {
         res.status(500).json({ message: `Error: ${e.message}` });
    }

});

router.get('/login', async (req, res) => {
       try{
        res.status(201).render('login', {});
       }
       catch (e) {
           res.status(500).json({message: `Error: ${e.message}`});
       }
});

router.get('/password-reset', async (req, res) => {
    try{
        res.status(201).render('passwordReset', {});
    }catch(e){
        req.logger.error(e.message);
        res.status(500).json({message: `Error: ${e.message}`});
    }

});

/*ruta para cambiar contraseña*/
router.get('/change/password/:userId/:token', async (req, res) => {
    try{
        const { token, userId } = req.params;
        res.status(201).render('updatePassword', {token: token, userId: userId });
    }catch(e){
        req.logger.error(e.message);
        res.status(500).json({message: `Error: ${e.message}`});
    }
});

router.get('/products/create-product', passportCall('jwt'), handlePermissions(["PREMIUM", "ADMIN"]),  async (req, res) => {
    try{
        //req.logger.info({userIs: req.user.role});
        res.status(200).render('createProduct', {});
    }catch(e){
        req.logger.error(e.message);
        res.status(500).json({message: `Error: ${e.message}`});
    }
});

router.get('/upload/', async (req, res) => {
    try{
        res.status(200).render('uploadDocs', {});
    }catch(e){
        req.logger.error(e.message);
        res.status(500).json({message: `Error: ${e.message}`});
    }
})

/*ruta de handlebars para eliminar producto*/
router.post('/api/product/:pid/', passportCall('jwt'), handlePermissions(["PREMIUM", "ADMIN"]), ownerDeleteProduct, productsController.deleteProductById);

module.exports = router;


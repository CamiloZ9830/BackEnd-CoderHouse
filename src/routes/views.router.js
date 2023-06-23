const { Router } = require('express');
//const ProductManager = require('../dao/fsDao/ProductManager');
const router = Router();
const ProductsController = require('../controllers/products.controller');
const CartController = require('../controllers/cart.controller');
const { passportCall, handlePermissions } = require('../utils/authorization.utils');


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


router.get('/realTimeChat', passportCall('jwt'), handlePermissions(["USER"]), async (req, res) => {
    try {
        const user = {email: req.user.email, userName: req.user.userName}

          res.render('chat', {user: user});
     
    }
    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
});



/* se usas queries como limit, page, product category (RoadBikes, ElectricBikes, accesorios etc.) y sort */
router.get('/products', passportCall('jwt'), productsController.getProducts);

/*Esta ruta renderiza los productos del carrito de un suario por id de carrito */
router.get('/carts/:cid/', passportCall('jwt'), cartController.getCartByIdPopulate);

/*ruta de handlebars view para agregar un producto al carrito de un usuario logueado con la estrategia jwt */
router.post('/carts/:cid/product/:pid', passportCall('jwt'), cartController.addProductId);

router.post('/carts/:cid/purchase',passportCall('jwt'), cartController.purchaseOrder);

router.get('/register', async (req, res) => {
    try {
        res.render('register', {});
    }

    catch (e) {
         res.status(500).json({message: `Error: ${e.message}`});
    }

});

router.get('/login', async (req, res) => {
       try{
        res.status(201).render('login', {})
       }
       catch (e) {
           res.status(500).json({message: `Error: ${e.message}`});
       }
});



module.exports = router;


const { Router } = require('express');
//const ProductManager = require('../dao/fsDao/ProductManager');
const router = Router();
const passport = require('passport');
const ProductsController = require('../controllers/products.controller');
const CartController = require('../controllers/cart.controller');


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


router.get('/realTimeProducts', async (req, res) => {
    try {
        
        const getProducts = await callNewProduct.getProducts();
     
          res.render('realTimeProducts', {getProducts});
     
    }
    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
    
});


router.get('/realTimeChat', async (req, res) => {
    try {
     
          res.render('chat', {});
     
    }
    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
});



/* se usas queries como limit, page, product category (RoadBikes, ElectricBikes, accesorios etc.) y sort */
router.get('/products', passport.authenticate('jwt', { session: false }), productsController.getProducts);

/*Esta ruta renderiza los productos del carrito de un suario por id de carrito */
router.get('/carts/:cid/', passport.authenticate('jwt', {session: false}), cartController.getCartByIdPopulate);

/*ruta de handlebars view para agregar un producto al carrito de un usuario logueado con la estrategia jwt */
router.post('/carts/:cid/product/:pid', passport.authenticate('jwt', {session: false}), cartController.addProductId);


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


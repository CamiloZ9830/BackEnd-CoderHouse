const { Router } = require('express');
//const ProductManager = require('../dao/fs/ProductManager');
const router = Router();
const mongoDBProductsManager = require('../dao/mongoDB/mongoProductManager');
const mongoProductManager = new mongoDBProductsManager();
const mongoDBCartsManager = require('../dao/mongoDB/mongoCartsManager');
const { getAge } = require('../utils');
const passport = require('passport');
const mongoCartsManager = new mongoDBCartsManager();
//const filePath = path.resolve(__dirname, '../dao/fs/products-file.json');
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

/*este middleware verifica si el usuario viene por passport-github-session o passport-jwt strategy*/
const skipJwtAuthentication = (req, res, next) => {
    console.log("github authenticated? ",req.isAuthenticated());
    if (req.isAuthenticated() && req.session.user && req.session.user.lastName === 'github') {
       
        return next();
    }
    passport.authenticate('jwt', { session: false })(req, res, next);
};


/* se usas queries como limit, page, product category (RoadBikes, ElectricBikes, accesorios etc.) y sort */
router.get('/products', skipJwtAuthentication, async (req, res) => {
    try {
        const limit = req.query.limit || 8;
        let page = parseInt(req.query.page) || 1;
        const category = req.query.category || {};
        const sort = req.query.sort || {};  
        
        const cartId = req.user.cartId;
        const getDbCart = await mongoCartsManager.getCartById(cartId);
        const total = getDbCart ? getDbCart.products.reduce((total, quantity) => total + quantity.quantity, 0) : 0;
        
        let github = null;
        if (req.isAuthenticated() && req.session.user){  
            github = structuredClone(req.session.user);
        }
        let user = structuredClone(req.user);
        user["age"] = getAge(user.dateOfBirth);


        const getDbProducts = await mongoProductManager.getProducts(Number(limit), page, category, sort);

        if (page > getDbProducts.totalPages) {
            return res.redirect(`/products?page=${getDbProducts.totalPages}`);         
        }
        else if (isNaN(page) || page < 1) {
            return res.redirect(`/products?page=${1}`);
        }

        

        const docs = getDbProducts.docs.map(product => Object.assign({}, product));
        res.render('home', { paginatedDocs: docs, paginatedInfo: getDbProducts, userSession:  Object.keys(user).length > 4 ? user : github, total: total});
        
    }

    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
});

/*Esta ruta renderiza los productos del carrito de un suario por id de carrito */
router.get('/carts/:cid/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const { cid } = req.params;      
        const getDbCart = await mongoCartsManager.getCartByIdPopulate(cid);
        const total = getDbCart.products.reduce((total, quantity ) => total + quantity.quantity, 0) || 0;
         
        res.render('home', { getDbCart: getDbCart, total: total});
    }

    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
});

/*ruta de handlebars view para agregar un producto al carrito de un usuario logueado con la estrategia jwt */
router.post('/carts/:cid/product/:pid', passport.authenticate('jwt', {session: false}), async (req, res) => {
      try{
        const { cid, pid } = req.params;
        const addProduct = await mongoCartsManager.addProductId(cid, pid);
        res.redirect('back');
      }

      catch(e) {
        res.status(500).json({message: `Error: ${e.message}`});
      }
});


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


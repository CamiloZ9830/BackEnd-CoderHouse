const { Router } = require('express');
//const ProductManager = require('../dao/fs/ProductManager');
const router = Router();
const path = require('path');
const mongoDBProductsManager = require('../dao/mongoDB/mongoProductManager');
const mongoProductManager = new mongoDBProductsManager();
const mongoDBCartsManager = require('../dao/mongoDB/mongoCartsManager');
const mongoCartsManager = new mongoDBCartsManager();
//const filePath = path.resolve(__dirname, '../dao/fs/products-file.json');
//const callNewProduct = new ProductManager(filePath);



router.get('/', async (req, res) => {
    try {
        res.render('home', {});
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


const isAuthenticatedView = async (req, res, next) => {
      if (req.session.user) {
        console.log("this is sessions: ", req.session.user);
        next();
        return;
      }  

      if (req.session.role === "Admin"){
        next();
        return;
      }
      
      res.render('login', {});
}; 

/* se usas queries como limit, page, product category (RoadBikes, ElectricBikes, accesorios etc.) y sort */
router.get('/products', isAuthenticatedView, async (req, res) => {
    try {
        const limit = req.query.limit || 8;
        let page = parseInt(req.query.page) || 1;
        const category = req.query.category || {};
        const sort = req.query.sort || {};

        const user = req.session.user;
        let adminCredentials = null;
        if (req.session.role === "Admin") {
            adminCredentials = {
                user: user.userName,
                admin: req.session.role
            }          
        };
        
 
        const getDbProducts = await mongoProductManager.getProducts(Number(limit), page, category, sort);

        if (page > getDbProducts.totalPages) {
            return res.redirect(`/products?page=${getDbProducts.totalPages}`);         
        }
        else if (isNaN(page) || page < 1) {
            return res.redirect(`/products?page=${1}`);
        }

        const docs = getDbProducts.docs.map(product => Object.assign({}, product));
        res.render('home', { paginatedDocs: docs, paginatedInfo: getDbProducts, userSession: user, admin: adminCredentials });
        
    }

    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
});

/*Esta ruta renderiza los productos del un carrito por id de carrito */
router.get('/carts/:cid/', async (req, res) => {
    try {
        const { cid } = req.params;      
        const getDbCart = await mongoCartsManager.getCartByIdPopulate(cid);

        res.render('home', { getDbCart });
    }

    catch (e) {
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


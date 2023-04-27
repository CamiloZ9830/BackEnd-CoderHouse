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

router.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit || 8;
        let page = parseInt(req.query.page) || 1;
        const category = req.query.category || {};
        const sort = req.query.sort || {};
        
    if (isNaN(page) || page <= 0) {
        page = 1;
      }
        const getDbProducts = await mongoProductManager.getProducts(Number(limit), Number(page), category, sort);
        const docs = getDbProducts.docs.map(product => Object.assign({}, product));

        res.render('home', { paginatedDocs: docs, paginatedInfo: getDbProducts });
    }

    catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
});


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



module.exports = router;


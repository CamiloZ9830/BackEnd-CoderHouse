const { Router } = require('express');
const ProductManager = require('../ProductManager');
const router = Router();
const path = require('path');
const filePath = path.resolve(__dirname, '../products-file.json');
const callNewProduct = new ProductManager(filePath);


router.get('/', async (req, res) => {
    try {
        const getProducts = await callNewProduct.getProducts();

        res.render('home', {getProducts});
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
    
} )


module.exports = router;


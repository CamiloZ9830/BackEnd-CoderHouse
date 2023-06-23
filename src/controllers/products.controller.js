const CartService = require('../services/cart.service');
const ProductService = require('../services/products.service');
const { getAge } = require('../utils/session.utils');


class ProductsController {
        constructor() {
            this.productService = new ProductService()
            this.cartService = new CartService()
        }


        getProducts = async (req, res) => {

            try {
                const limit = req.query.limit || 8;
                let page = parseInt(req.query.page) || 1;
                const category = req.query.category || {};
                const sort = req.query.sort || {};  
                
                const cartId = req.user.cartId;
                const getDbCart = await this.cartService.getCartById(cartId);
                const total = getDbCart ? getDbCart.products.reduce((total, quantity) => total + quantity.quantity, 0) : 0;
                
                let user = structuredClone(req.user);
                user["age"] = getAge(user.dateOfBirth);
                console.log("this user:", user);
        
        
                const getDbProducts = await this.productService.getProducts(Number(limit), page, category, sort);
        
               

                if (page > getDbProducts.totalPages) {
                    return res.redirect(`/products?page=${getDbProducts.totalPages}`);         
                }
                else if (isNaN(page) || page < 1) {
                    return res.redirect(`/products?page=${1}`);
                }  
                
                     const docs = getDbProducts.docs.map(product => Object.assign({}, product));
                        res.render('home', { paginatedDocs: docs, paginatedInfo: getDbProducts, userSession: user, total: total});
                
            }
        
            catch (e) {
                res.status(500).json({message: `Error: ${e.message}`});
            }
        };

        addProduct = async (req, res) => {
            try {
                    const product = req.body;
                    const newProduct = await this.productService.addProduct(product);             
                    res.status(201).send({ status: 'success', payload: newProduct});
            } catch(e) {
                res.status(500).json({message: `Error: ${e.message}`});
            }
        };

          findProductById = async (req, res) =>  {
            try {
                const { pid } = req.params;         
                const findProduct = await this.productService.findProductById(pid);
                      
                    if (!findProduct) return res.status(404).send({status: 'error', message: `Product with number ID ${pid} was not found`});
                     return res.status(200).send({status: 'success', payload: findProduct});
                    
                                
            } catch (e) {
                res.status(500).json({message: `Error: ${e.message}`});
            }
       };

       updateProductById = async (req, res) =>  {
        try {
            const { pid } = req.params;
            const product = req.body;             
                 const updatedProduct = await this.productService.updateProductById(pid, product);
              if (!updatedProduct) return res.status(404).send({status: 'error', message: "Product could not be updated"});
              return res.status(201).send({status: 'success', payload: updatedProduct});
            
          } catch (e) {
            res.status(500).json({message: `Error: ${e.message}`});
        }
   };

   deleteProductById = async (req, res) =>  {
    try {
        const {pid} = req.params;
        const deleteProductById = await this.productService.deleteProduct(pid);             
        res.status(200).send({status: 'success', message: deleteProductById});
        //io.sockets.emit('newProduct', {status: "success", massage: `product with pid ${pid} deleted`, payload: allProducts});
    } catch (e) {
        res.status(500).json({message: `Error: ${e.message}`});
    }
};


};

module.exports = ProductsController;
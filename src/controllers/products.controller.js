const CartService = require('../services/cart.service');
const ProductService = require('../services/products.service');
const { getAge } = require('../utils');


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
        
        
                const getDbProducts = await this.productService.getProducts(Number(limit), page, category, sort);
        
                const { hasNextPage, hasPrevPage, nextPage, prevPage } = getDbProducts;
                const products1 = "http://localhost:8080/api/products";
          
                /*objeto agrega "nextLink" y "prevLink"  */
                /*para la vista de productos se usa la direccion /products que esta en views.router */
                hasNextPage ? getDbProducts["nextLink"] = `${products1}?page=${nextPage}`
                : getDbProducts["nextLink"] = null;
                hasPrevPage ? getDbProducts["prevLink"] = `${products1}?page=${prevPage}` 
                : getDbProducts["prevLink"] = null;

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
                      
                    if (findProduct) return res.status(200).send({status: 'success', payload: findProduct});
                    return res.status(404).send({status: 'error', message: `Product with number ID ${pid} was not found`});
                                
            } catch (e) {
                res.status(500).json({message: `Error: ${e.message}`});
            }
       };

       updateProductById = async (req, res) =>  {
        try {
            const { pid } = req.params;
            const product = req.body;             
                 const updatedProduct = await this.productService.updateProductById(pid, product);
              if (updatedProduct) return res.status(201).send({status: 'success', payload: updatedProduct});
            
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
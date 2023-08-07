const CustomError = require('../services/customizedErrors/CustomError');
const CartService = require('../services/cart.service');
const { EError } = require('../services/customizedErrors/error.enums');
const ProductService = require('../services/products.service');
const { generateProductErrorInfo } = require('../services/customizedErrors/error.info')
const { getAge } = require('../utils/session.utils');


class ProductsController {
        constructor() {
            this.productService = new ProductService()
            this.cartService = new CartService()
        }


        getProductsRender = async (req, res) => {

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

        getProducts = async (req, res) => {

            try {
                const limit = req.query.limit || 8;
                let page = parseInt(req.query.page) || 1;
                const category = req.query.category || {};
                const sort = req.query.sort || {};  
                   
                const getDbProducts = await this.productService.getProducts(Number(limit), page, category, sort);
        
                if (page > getDbProducts.totalPages) {
                    return res.redirect(`/products?page=${getDbProducts.totalPages}`);         
                }
                else if (isNaN(page) || page < 1) {
                    return res.redirect(`/products?page=${1}`);
                }  
                
                    
                getDbProducts ? res.status(200).send({status: 'success', payload: getDbProducts})
                : res.status(400).send({status: 'error', payload: getDbProducts});
                
            }
        
            catch (e) {
                res.status(500).json({message: `Error: ${e.message}`});
            }
        };

        

        createProduct = async (req, res, next) => {
            try {
                    const product = req.body;
                    const { email } = req.user || 'admin';
                    const { title, category, price } = product;
                    console.log("this error",product, email);
                    /* manejador de errores customizados que valida las propiedades, titulo, codigo, categoria y precio de un producto*/
                    if(!title || !category || !price){
                        CustomError.createError({
                            name: "Product creation error",
                            cause: generateProductErrorInfo(product),
                            message: "Error trying to create a new product",
                            code: EError.INVALID_TYPES_ERROR,
                        })
                    };
                    const newProduct = await this.productService.addProduct(product, email);             
                    res.status(201).send({ status: 'success', payload: newProduct});
            } catch(e) {
                req.logger.error(e.message);
                next(e.message);
            }
        };

        /* controlador que crea productos con faker-js*/
        mockingProducts = async (req, res) => {
            try{
                const productsMock = [];
                for (let i = 0; i <= 50; i++) {
                    const product = await this.productService.createRandomProduct();
                    productsMock.push(product);
                }
                return res.status(200).send({status: 'success', payload: productsMock});
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
              req.logger.info(`
              Request: ${req.method} in ${req.url}
              ${req.user?.userName ?? 'User information not available'}
              ${ new Date().toLocaleTimeString()}`);
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
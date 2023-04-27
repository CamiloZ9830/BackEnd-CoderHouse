const {readFile, writeFile, existsSync} = require('fs');
const util = require('util');
const ProductManager = require('../fs/ProductManager');
const readFilePromise = util.promisify(readFile);
const writeFilePromise = util.promisify(writeFile);
const path = require('path');






module.exports = class CartsManager {
    constructor (path) {
        this.carts = [];
        this.path = path;
    }


         getCarts = async () => {
            const fileExists = existsSync(this.path);
        
        if (fileExists) {
            try{
                const readJsonFile = await readFilePromise(this.path, 'utf8')
                this.carts = await JSON.parse(readJsonFile);
                
            }
            catch (e) {
                console.error(e);
            }
           
        }
        else {
            console.log(this.carts);
            
        }
            
       return this.carts
    }
         

        addCart = async () => {
            
             
            const cart = {
                products: []
               }

               this.carts =  await this.getCarts();

               if (this.carts.length > 0) {

                cart.id = this.carts[this.carts.length-1].id +1;
                   this.carts.push(cart);
                  
                   try {
                       await writeFilePromise(this.path, JSON.stringify(this.carts, null, 2 ));
                       console.log(`Success: Cart with Id number ${cart.id} has been added`);
                      }
                      catch (e) {
                          console.error(e);
                      }
               }

               else {
                cart.id = 1;
                this.carts.push(cart);
                
                try {
                    await writeFilePromise(this.path, JSON.stringify(this.carts, null, 2));
                    console.log(`Success: Cart with Id number ${cart.id} has been added`);
                }
                catch (e) {
                    console.log(e);
                }
               }

               return cart
        };

        getCartProductById = async (id) => {
            const filePath = path.resolve(__dirname, './products-file.json');
           const callProd = new ProductManager(filePath);
                  try {
                         this.carts = await this.getCarts();
                         const findCart =  this.carts.find(cart => cart.id === id);
                         const {products} = findCart;
                         
                         const prodList = products.map(prod => {return prod.product});
                     
                         const getProd = await callProd.getProducts();
                     
                         const filterProd = getProd.filter(prod => prodList.includes(prod.id));
                         return filterProd

                  }

                  catch (e) {
                    console.error(e);
                  }
                
        };

        findProductId = async (cartId, prodId) => {
            try {
                this.carts = await this.getCarts();
                const findCart =  this.carts.find(cart => cart.id === cartId);
                const findProd = findCart.products.findIndex( prod => prod.product === prodId)
                return findProd
            }
            catch (e) {
                console.error(e);
            }
        }



        updateProdQuantity = async (cartId, prodId, quantity) => {
             try {
                this.carts = await this.getCarts();
                const findCart = this.carts.findIndex(cart => cart.id === cartId);
                const findProd = this.carts[findCart].products.findIndex(prod => prod.product === prodId);
                
                if (findProd > -1) {
                    this.carts[findCart].products[findProd].quantity = quantity;
                    await writeFilePromise(this.path, JSON.stringify(this.carts, null, 2 ));
                    return {status: "success", message: "Quantity succesfully updated"}
                } 
                else {
                    return {status: "failed", message: "Product not Found in cart"}
                }

             }

             catch (e) {
                console.error(e);
             }


        };


        addCartProductId = async (cartId, prodId) => {
                 
            const prod = {
                product: prodId,
                quantity: 1
             }
                  try {
                    this.carts = await this.getCarts();
                    const findCart = this.carts.find(cart => cart.id === cartId);
                    const findProd = findCart.products.find(prod => prod.product === prodId);
                                
                                if (findProd) {
                                    findProd.quantity = findProd.quantity + 1;
                                 
                                 await writeFilePromise(this.path, JSON.stringify(this.carts, null, 2 ));
                                 return findProd
                             }
                             else {
                                findCart.products.push(prod);
                                await writeFilePromise(this.path, JSON.stringify(this.carts, null, 2 ));
                                return prod
                             }

                         }
                  catch (e) {
                    console.error(e);
                  }
        };

        DeleteCartProductById = async (cartId, prodId) => {
            
                  try {
                    this.carts = await this.getCarts();
                    const findCart = this.carts.find(cart => cart.id === cartId);
                    const findProd = findCart.products.findIndex((prod) => prod.product === prodId);
                    let prodQuantity = findCart.products[findProd].quantity
                                    
                                    if (prodQuantity > 1) {
                                        findCart.products[findProd].quantity -= 1;

                                     await writeFilePromise(this.path, JSON.stringify(this.carts, null, 2 ));
                                        return prodQuantity;
                                   }
                                 else if (prodQuantity === 1){                     
                                    findCart.products.splice(findProd, 1); 

                                    await writeFilePromise(this.path, JSON.stringify(this.carts, null, 2 ));
                                    return 'Product removed from the cart'
                                 }
                                }
                  catch (e) {
                    console.error(e);
                  }
        };

};
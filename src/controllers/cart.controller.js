const UserDto = require("../dto/user.dto");
const CartService = require("../services/cart.service");



class CartController {
        constructor() {
             this.cartService = new CartService
        }


        addCart = async (req, res) => {
            try{
                const saveCart = await this.cartService.addCart();
                if (saveCart) return res.status(201).send({status: 'success', payload: saveCart});

            } catch(e) {
                const user = req.user ? `User: ${req.user._id}` : 'User information not available';
                const requestInfo = `Request: ${req.method} in ${req.url}`;
                const warningMessage = 'A potential issue or warning was detected.';
                req.logger.warning(`
                ${warningMessage}
                ${requestInfo}
                ${user}
                Timestamp: ${new Date().toLocaleTimeString()}
                `);
                res.status(500).json({message: e.message});
            }
        };

        purchaseOrder = async (req, res) => {
            const { cid } = req.params;
            try{
                    const userDto = new UserDto(req.user);
                    const userData = await userDto.userPurchaseData();
                    const ticketOrder = await this.cartService.cartPurchase(cid, userData);
                    if (!ticketOrder) return  res.status(500).send({status: 'error', message: 'Order not recieved'});
                    
                   return res.status(201).render('purchase', {payload: ticketOrder});
                    
            } catch (e) {
                const user = req.user ? `User: ${req.user._id}` : 'User information not available';
                const requestInfo = `Request: ${req.method} in ${req.url}`;
                req.logger.fatal(` Unexpected error:
                ${user}
                ${requestInfo}
                ${ new Date().toLocaleTimeString()}`);
                res.status(500).json({message: e.message});
            }
        };

        getCartByIdPopulate = async (req, res) => {
            try{
                const {cid} = req.params;
                const getCartPopulate = await this.cartService.getCartByIdPopulate(cid);
                let total = 0;
                if (getCartPopulate) {
                    total = getCartPopulate.products.reduce((total, quantity ) => total + quantity.quantity, 0) || 0
                    let user = structuredClone(req.user);
                    return res.render('home', { getDbCart: getCartPopulate, userSession: user, total: total }); /*res.status(200).send({status: 'success', payload: getCartPopulate});*/
                } else {

                    return res.status(404).send({status: 'error', message: 'Resource Not Found'});
                }  
        
            } catch(e) {
                res.status(500).json({message: e.message});
            }
        };

        getCartById = async (req, res) => {
            try{
                const {cid} = req.params;
                const getCartIds = await this.cartService.getCartById(cid);

                if (getCartIds) return res.status(200).send({status: 'success', payload: getCartIds});
                return res.status(404).send({status: 'error', message: 'Resource Not Found'});
            } catch(e) {
                res.status(500).json({message: e.message});
            }
        };

        addProductId = async (req, res) => {
            try{
                const {cid, pid} = req.params;
                const addProductId = await this.cartService.addProductId(cid, pid);

                if (addProductId) {
                    return /*res.redirect('back');*/ res.status(200).send({status: 'success', payload: addProductId});
                } else {
                    return res.status(404).send({status: 'error', message: 'Resource Not Found'});
                }
            } catch(e) {
                res.status(500).json({message: e.message});
            }
        };

        deleteFromCart = async (req, res) => {
            try{
                const { cid, pid } = req.params;
                const deleteProductIdFromCart = await this.cartService.deleteFromCart(cid, pid);
                if(!deleteProductIdFromCart) return res.status(200).redirect({status: 'error', message: "Error updating your cart, try again!"});
                    res.status(200).redirect('back');
                return deleteProductIdFromCart; 
            }catch(e){
                throw new Error(e.message);
            }
        };

        arrayOfProducts = async (req, res) => {
            try{
                const { cid } = req.params;
                const newArrayProd = req.body;

                if (Array.isArray(newArrayProd) ) {
                      const updateCart = await this.cartService.addNewArrayOfProducts(cid, newArrayProd);
                      updateCart ? res.status(200).send({status: 'success', payload: updateCart})
                      : res.status(404).send({status: 'error', message: 'Resource not found'});
                };

        }

        catch (e) {
                res.status(500).json({message: e.message});
        }
        };

        addQuantity = async (req, res) => {
            try {
                const { quantity } = req.body;
                const { cid, pid } = req.params;

                    if (quantity > 0 && quantity < 11) {
                            //const quantityUpdate =  await callCart.updateProdQuantity(Number(cid), Number(pid), quantity);
                            const updateProdQuantity = await this.cartService.addProductQuantity(cid, pid, quantity);
    
                              updateProdQuantity ? res.status(201).send({status: 'success', payload: updateProdQuantity})
                              : res.status(404).send({status: 'error', message: 'Resource Not Found' });
                    }
                    else {
                        res.status(500).send(`Value too high or too low to update`);
                    }              
        }   
        catch (e) {
                res.status(500).json({message: e.message});
        }};

    deleteProductId = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            //const deleteProd = await callCart.DeleteCartProductById(Number(cid), Number(pid));
            const deleteProd = await this.cartService.deleteProductId(cid, pid);

            if (deleteProd) return res.status(200).send({status: 'success', payload: deleteProd})
            return res.status(404).send({status: 'error', message: 'Resource Not Found' });
     }

     catch (e) {
            res.status(500).json({message: e.message});
     }
        };


        deleteAll = async (req, res) => {
            try{
                const { cid } = req.params;
                const addProductId = await this.cartService.deleteAllProducts(cid);

                if (addProductId) return res.status(200).send({status: 'success', payload: addProductId});
                return res.status(404).send({status: 'error', message: 'Resource Not Found'});
            } catch(e) {
                res.status(500).json({message: e.message});
            }
        };
};


module.exports = CartController;
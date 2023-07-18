const MongoProductsDao = require('../../dao/mongoDao/mongoProductDao');
const MongoUsersDao = require('../../dao/mongoDao/mongoUsersDao');


const mongoUsersManager = new MongoUsersDao();
const mongoProductManager = new MongoProductsDao();


const userNameValidator = async (req, res, next) => {
    const {userName} = req.body;
    try {
        const field = {"userName" : userName}
        const userNameExists = await mongoUsersManager.fieldValidator(field);

        if(!userNameExists) {
            next();
            return;
        } 
        else {
            res.status(409).send("Your username is already taken");
        }

    }

    catch(e) {
        console.error(e.message);
    }

};

const emailValidator = async (req, res, next) => {
    const { email } = req.body;
    const field = {"email" : email};
    const emailExists = await mongoUsersManager.fieldValidator(field);

    if(!emailExists) {
     next();
     return;
    }
    else {
        res.status(409).send('Your email is already taken');
    }
};

const objectValidation = (req, res, next) => {
    const product = req.body;
    const requiredAttrs = ['title', 'description', 'price', 'thumbnail', 'code', 'stock', 'category'];
    const isValid = requiredAttrs.every(attr => product.hasOwnProperty(attr) && product[attr]);
  
    if (isValid) {
      next();
      return
    } else {
      res.status(404).send('Invalid product object');
    }
  };

  const objectValidationUpdate = (req, res, next) => {
  
    const product = req.body;
    const requiredAttrs = ['title', 'description', 'price', 'thumbnail', 'code', 'stock', 'status', 'category'];
    const validAttrs = Object.keys(product).every(attr => requiredAttrs.includes(attr));
    const isValid = validAttrs && requiredAttrs.every(attr => !product.hasOwnProperty(attr) || product[attr] !== null);
  
    if (isValid) {
      
      Object.keys(product).forEach(key => {
        if (product[key] === null) {
          delete product[key];
        }
      });
  
      req.body = product;
      next();
      return;
    } else {
      res.status(404).send('Invalid attribute(s) in object');
    }
  };

  const ownerValidate = async (req, res, next) => {
    const { email } = req.user;
    const { pid } = req.params;
      try{
        const getProd = await mongoProductManager.findProductById(pid);
        if(getProd?.owner === email){
          res.status(409).send("Cannot buy your own products");
          return;
        }else {
          next();
          return;
        }
      }catch(e) {
        throw new Error(e.message);
      }
  };

   const ownerDeleteProduct = async (req, res, next) => {
      const { email, role } = req.user;
      const  { pid } = req.params;
      try{
        const getProd = await mongoProductManager.findProductById(pid);
        if(role === 'admin') {
          next();
          return;
        } else if (getProd?.owner === email){
           next();
           return;
        }
        else{
          res.status(409).send("Can only delete your own products");
          return;
        }
      }catch(e){
         throw new Error(e.message);
      }
   };


  


module.exports = {
    emailValidator,
    userNameValidator,
    objectValidation,
    objectValidationUpdate,
    ownerValidate,
    ownerDeleteProduct,
}
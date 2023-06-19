const MongoUsersDao = require('../../dao/mongoDao/mongoUsersDao');


const mongoUsersManager = new MongoUsersDao();


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


module.exports = {
    emailValidator,
    userNameValidator,
    objectValidation,
    objectValidationUpdate
}
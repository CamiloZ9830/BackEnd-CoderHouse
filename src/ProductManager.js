const {readFile, writeFile, existsSync} = require('fs');
const util = require('util');
const readFilePromise = util.promisify(readFile);
const writeFilePromise = util.promisify(writeFile);





module.exports = class ProductManager {
    constructor (path) {
        this.products = [];
        this.path = path;
    }
    
    getProducts = async () => {
        const fileExists = existsSync(this.path);
        
        if (fileExists) {
            try{
                const readJsonFile = await readFilePromise(this.path, 'utf8')
                this.products = await JSON.parse(readJsonFile);
                 //console.log(this.products);
            }
            catch (e) {
                console.error(e);
            }
           
        }
        else {
            console.log(this.products);
            
        }
            
       return this.products
    }


    addProduct = async (product) =>  {

          const {title, description, price, thumbnail, code, stock, category} = product;
          
       const prod = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status1: true,
        category
       };

       const emptyString = Object.values(prod).includes("");
  
       if (!emptyString) {
    
            this.products = await this.getProducts();      
      }
      else {

        throw new Error('Missing fields');
    }
  
    if (this.products.length > 0) {
 
        const uniqueCode = this.products.some((prod) => prod.code === code);
        //console.log("Code number Exists?", uniqueCode );
        if (uniqueCode) {
            throw new Error('Code field is not unique');
        }
        else {
            this.products =  await this.getProducts();

            prod.id = this.products[this.products.length-1].id +1;
               this.products.push(prod)
              
               try {
                   await writeFilePromise(this.path, JSON.stringify(this.products, null, 2 ));
                   console.log(`Success: Product ${title} with Id number ${prod.id} has been added`);
                  }
                  catch (e) {
                      console.error(e);
                  }
        }}

        else {
            prod.id = 1;
            this.products.push(prod);
            
            try {
                await writeFilePromise(this.path, JSON.stringify(this.products, null, 2));
                console.log(`Success: Product ${title} with Id number ${prod.id} has been added`);
            }
            catch (e) {
                console.log(e);
            }
        }
        return prod;

         };
         

        getProductById  = async (id) => {
             try {
                
                 const toArray = await this.getProducts();
                 const findId = toArray.find((item) => item.id === id)
                    if (findId) {
                         return  findId;
                           }
                      else {
                             throw new Error('Not Found')
                           }
                  }
             catch (e) {
                console.error(e);
             }
           };

            updateProductById = async (id, product) => {
                let updatedProduct = {}
                try {
                    
                    this.products = await this.getProducts();
                    const findId = this.products.find((item) => item.id === id)

                    const emptyString = Object.values(product).includes("");
           
                     const newObj = {...product}
        
                     if (findId && !emptyString) {
                                             
                        const uniqueCode =  this.products.some((prod) => prod.code === newObj.code);
                        //console.log("Code number Exists?", uniqueCode );
                         if (uniqueCode) {
                                   throw new Error('Code field is not unique');
                                        }
                           else {
                             updatedProduct = Object.assign(findId, newObj);
                              console.log(updatedProduct);
                               console.log(`Success: Product with ID number ${id} has been updated`);
                        
                      try {
                        await writeFilePromise(this.path, JSON.stringify(this.products, null, 2));
                        
                      }
                      catch (e) {
                        console.error(e);
                      }

                           }             
                            
               
                            
        }

        else return ('Does not match the criteria to update product');
         
                }

                catch (e) {
                    console.error(e);
                }

            return updatedProduct

            };

            deleteProductById = async (id) => {
                 
                try {
                    
                    this.products = await this.getProducts();
                    const findProd = this.products.findIndex((item) => item.id === id);
                    //console.log('the index is:',findProd);

                if(findProd > -1) {
                     
                    this.products.splice(findProd, 1); 
                    try {
                        await writeFilePromise(this.path, JSON.stringify(this.products, null, 2));
                       
                     
                     return `Product with id number ${id} has been deleted`;
                    }
                    catch (e) {
                        console.error(e);
                    }
                    
                 }
                 else {
                    throw new Error (`Id number ${id} doesnt exist`);
                 
                }
            }
            catch (e) {
                console.error(e);
            }
};
};



//const filePath = './products-file.json'


//const callNewProduct = new ProductManager(filePath);
//const app = async () =>  {
//console.log( 'empty array', await callNewProduct.getProducts());
//await callNewProduct.addProduct(bike.giant);
//await callNewProduct.addProduct(bike.electric);
//await callNewProduct.addProduct(bike.kidsBike);
//await callNewProduct.addProduct(bike.cannondale);
//await callNewProduct.addProduct(bike.trek);
/*console.log('get products', await callNewProduct.getProducts());
console.log('find by id', await callNewProduct.getProductById(1));
console.log('update', await callNewProduct.updateProductById(1, kidsBike));
console.log('get products', await callNewProduct.getProducts());
console.log( await callNewProduct.deleteProductById(1));
console.log('get products', await callNewProduct.getProducts());*/
//};

//app();







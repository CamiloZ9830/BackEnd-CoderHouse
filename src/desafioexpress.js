const express = require('express');
const path = require('path');
const app = express();
const ProductManager = require('./public/ProductManager')

app.use(express.urlencoded({extended: true}))

const filePath = './src/content/products-file.json'

app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, './public/index.html'))
});

const callNewProduct = new ProductManager(filePath);

app.get('/products', async (req, res) => {
      const products =  await callNewProduct.getProducts();

      const { limit } = req.query;
   

      if (limit) {
        const prod = products.slice(0, Number(limit));

        const prod2 = prod.map((item) => {
          const {title, description, price, thumbnail, code, stock, id} = item
          
          return `<div>
          <p><b>ID: ${id}</b></p>
          <h2>${title}</h2>
          <p>${description}</p>
          <img width="420" src="${thumbnail}" alt="${title}">
          <p>Price: ${price}</p>
          <p>Code: ${code}</p>
          <p>Stock: ${stock}</p>
        </div>`;
  
        }).join('');

        
     
        res.status(200).send(prod2);
           
      }

      else {

        const prod2 = products.map((item) => {
          const {title, description, price, thumbnail, code, stock, id} = item
          
          return `<div>
          <p><b>ID: ${id}</b></p>
          <h2>${title}</h2>
          <p>${description}</p>
          <img width="420" src="${thumbnail}" alt="${title}">
          <p>Price: ${price}</p>
          <p>Code: ${code}</p>
          <p>Stock: ${stock}</p>
        </div>`;
  
        }).join('');

          
        res.status(200).send(prod2);
      }

});

app.get('/products/:pid', async (req, res) => {
  
  const products =  await callNewProduct.getProducts();
        
       const { pid } = req.params;
      
       const findProd = products.find(item => item.id === Number(pid));
        if (findProd) {
          const {title, description, price, thumbnail, code, stock, id} = findProd
        
          const prod2 = `<div>
          <p>ID: ${id}</p>
          <h2>${title}</h2>
          <p>${description}</p>
          <img src="${thumbnail}" alt="${title}">
          <p>Price: ${price}</p>
          <p>Code: ${code}</p>
          <p>Stock: ${stock}</p>
        </div>`;
  
        res.status(200).send(prod2);
        }

        else {
          res.status(404).send('product not found');
        }
       

       
});

app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});



app.listen(8080, () => {
  console.log('server is listening on port 8080...');
});




//const callNewProduct = new ProductManager(filePath);
//callNewProduct.addProduct(trek);
//callNewProduct.addProduct(electric);
//callNewProduct.addProduct(giant);
//callNewProduct.addProduct(kidsBike);
//console.log('empty array', callNewProduct.getProducts());
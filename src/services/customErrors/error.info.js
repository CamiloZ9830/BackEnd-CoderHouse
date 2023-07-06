const generateProductErrorInfo = (product) => {
    
    return `One or more porperties were incomplete or not valid.
    List of required properties:
    * title : needs to be a String, recieved ${product.title}
    * price : needs to be a String, recieved ${product.price}
    * code : needs to be a String, recieved ${product.code}
    * category : need to be a String, recieved ${product.category} `
};

module.exports = {
    generateProductErrorInfo,
}
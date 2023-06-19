/*Conexion a mongo con el como singleton instanciado en app.js*/
const mongoose = require('mongoose');
const { mongoUrl } = require('../config/dotenvVariables.config');

class MongoSingleton {
    static #instance;
    constructor(){
            mongoose.connect(mongoUrl, {
               useNewUrlParser: true,
               useUnifiedTopology: true
            });         
    }

    static getInstance() {
        if(this.#instance){
            console.log("Already Connected");
            return this.#instance;
        }
        this.#instance = new MongoSingleton();
        console.log("Connected to Mongo Atlas", mongoose.connection.readyState );
        return this.#instance;
    }
}


module.exports = MongoSingleton;
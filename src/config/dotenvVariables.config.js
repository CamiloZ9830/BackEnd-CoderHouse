require("dotenv").config({path:'./src/.env'})

/*variables de entorno */
module.exports = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    jwtKey: process.env.JWT_PRIVATE_KEY,
}
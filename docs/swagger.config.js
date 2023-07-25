

const swaggerOptions = {
    definition: {
        openapi:'3.0.3',
        info: {
            title: "Documentacion API BikeStore",
            version: '1.0.0',
            description: "Una descripcion de la API"
        }
    },
    apis: [`${__dirname}/**/*.yaml`]
};

module.exports = {
    swaggerOptions
}


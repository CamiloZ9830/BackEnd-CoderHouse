const chai = require('chai');
const supertest = require('supertest');
const { port } = require('../src/config/dotenvVariables.config');

const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);

describe('testing productos',() => {
    let prodId;
    describe('test crea un producto', () => {
        it('El endpoint POST /api/products-test/ debe crear exitosamente un nuevo producto',
        async () => {
                const productMock = {
                    title: "Testing product #1",
                    description: "Brief description",
                    price: 60,
                    stock: 18,
                    category: "Accesorios",
                }
                const { statusCode, _body, ok } = await requester.post('/api/products-test').send(productMock);
                prodId = _body.payload;
                expect(statusCode).to.be.equal(201);
                expect(_body.payload).to.be.ok;      
        });
    });
    describe('test obtiene un producto', () => {
        it('El endpoint GET /api/products/:pid debe traer el producto recien creado',
        async () => {
               const  { statusCode, _body, ok } = await requester.get(`/api/products/${prodId}`);
               expect(statusCode).to.be.equal(200);
               expect(_body.payload).to.have.property('_id');
               expect(_body.payload._id).to.be.equal(prodId);
        });
    });
   describe('test de eliminar producto', () => {
        it('El endpoint DELETE /api/products-test/:pid debe eliminar el producto recien creado',
        async () => {
            const { statusCode, _body, ok } = await requester.delete(`/api/products-test/${prodId}`);
            expect(statusCode).to.be.equal(200);
            expect(_body).to.be.ok;
            expect(_body.status).to.be.equal('success');
        });
    });
});
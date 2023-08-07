const chai = require('chai');
const supertest = require('supertest');
const { port } = require('../src/config/dotenvVariables.config');

const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);


describe('testing carrito', () => {
    let cartId;
    const prod1 = '643e0837c46f4ecca665642a';
    const prod2 = '643ab1161d68b13b81a9dfbe';
    describe('test crea un carrito', () => {
        it('El endpoint POST /api/carts/ debe crear exitosamente un nuevo carrito',
        async () => {
            const { statusCode, _body, ok } = await requester.post('/api/carts');
            console.log("test1", statusCode, _body, ok);
            cartId = _body.payload;
            expect(statusCode).to.be.equal(201);
            expect(_body.payload).to.be.ok;
            expect(typeof _body.payload).to.be.equal('string');
        });
    });
    describe('test agrega 2 productos al carrito', () => {
        it('El endpoint POST /api/carts/:cid/product/:pid debe agregar exitosamente 1 producto previamente definido',  
        async () => {
             const  { statusCode, _body } = await requester.post(`/api/carts/${cartId}/product/${prod1}`);
             console.log("test product: ", statusCode, _body);
             expect(statusCode).to.be.equal(200);
             expect(_body.status).to.be.equal('success');
             expect(_body.payload.acknowledged).to.be.ok;
        });
        it('El endpoint POST /api/carts/:cid/product/:pid debe agregar exitosamente 1 producto previamente definido',
        async () => {
            const  { statusCode, _body } = await requester.post(`/api/carts/${cartId}/product/${prod2}`);
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal('success');
            expect(_body.payload.acknowledged).to.be.ok;
        });
    });
    describe('test elimina exitosamente todos los productos en el carrito', () => {
        it('El endpoint DELETE /api/carts/:cid/ debe eliminar exitosamente todos los productos del carrito',
        async () => {
            const  { statusCode, _body } = await requester.delete(`/api/carts/${cartId}`);
            expect(statusCode).to.be.equal(200);
        } )
    });
});
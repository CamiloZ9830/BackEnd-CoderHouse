const chai = require('chai');
const supertest = require('supertest');
const  { port, jwtKey } = require('../src/config/dotenvVariables.config');
const jwt = require('jsonwebtoken');

const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);

describe('testing de sesion', () => {  
    const newUser = {
        firstName: "Fernando",
        lastName: "Alvarenga",
        userName: "fer",
        email: "fer@mail.com",
        dateOfBirth: "1991-10-30",
        password: "ferr123",
    }
    describe('test crea un nuevo ususario', () => {
        it('El endpoint POST /registration/ debe crear exitosamente un nuevo usuario',
        async () => {
                const { statusCode, _body } = await requester.post('/registration').send(newUser);
                expect(statusCode).to.be.equal(201);

        });
    });
    describe('test inicia sesion con el nuevo usuario registrado', () => {
        it('El endpoint POST /user-login/ debe retornar un jsonwebtoken que se compara con el objeto "newUser"',
        async () => {
            const { statusCode, _body } = await requester.post('/user-login').send({
                                                                                    ...newUser
                                                                                    });
            const decode = jwt.verify(_body.token, jwtKey);                      
            expect(statusCode).to.be.equal(200); 
            expect(_body.status).to.be.equal('success');
            expect(_body.token).to.be.ok;
            expect(decode.user).to.have.property('_id');
            expect(decode.user.email).to.be.equal(newUser.email);
            expect(decode.user.password).to.be.equal(null);
        });
    });
    describe('test elimina el usuario "newUser" recien creado', () => {
        it('El endpoint DELETE /user-delete/:uid/ elimina el usuario de la base de datos',
        async () => {
            const { statusCode, _body } = await requester.delete(`/api/users/delete/${newUser.email}`);
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal('success');
            expect(_body.payload.deletedCount).to.be.equal(1);
        });
    });
 });


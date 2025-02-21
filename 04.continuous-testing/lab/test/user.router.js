const app = require('../src/index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../src/dbClient');

chai.use(chaiHttp);
const { expect } = chai;

describe('User REST API', () => {
    beforeEach(() => {
        // Clean DB before each test
        db.flushdb();
    });

    after(() => {
        app.close();
        db.quit();
    });

    describe('POST /user', () => {
        it('should create a new user', (done) => {
            const user = {
                username: 'sergkudinov',
                firstname: 'Sergei',
                lastname: 'Kudinov'
            };

            chai.request(app)
                .post('/user')
                .send(user)
                .then((res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.status).to.equal('success');
                    expect(res).to.be.json;
                    done();
                })
                .catch((err) => {
                    throw err;
                });
        });

        it('should return an error when missing parameters', (done) => {
            const user = {
                firstname: 'Sergei',
                lastname: 'Kudinov'
            };

            chai.request(app)
                .post('/user')
                .send(user)
                .then((res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equal('error');
                    expect(res).to.be.json;
                    done();
                })
                .catch((err) => {
                    throw err;
                });
        });
    });

    describe('GET /user/:username', () => {
        it('should successfully get a user', (done) => {
            const user = {
                username: 'johndoe',
                firstname: 'John',
                lastname: 'Doe'
            };

            // Create a user first
            chai.request(app)
                .post('/user')
                .send(user)
                .then(() => {
                    // Retrieve the created user
                    chai.request(app)
                        .get(`/user/${user.username}`)
                        .then((res) => {
                            expect(res).to.have.status(200);
                            expect(res.body.status).to.equal('success');
                            expect(res.body.user.firstname).to.equal('John');
                            expect(res.body.user.lastname).to.equal('Doe');
                            done();
                        })
                        .catch((err) => {
                            throw err;
                        });
                })
                .catch((err) => {
                    throw err;
                });
        });

        it('should return an error when user does not exist', (done) => {
            chai.request(app)
                .get('/user/nonexistentuser')
                .then((res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.status).to.equal('error');
                    expect(res.body.msg).to.equal('User not found');
                    done();
                })
                .catch((err) => {
                    throw err;
                });
        });
    });
});
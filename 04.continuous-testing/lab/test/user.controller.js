const { expect } = require('chai');
const userController = require('../src/controllers/user');
const db = require('../src/dbClient');

describe('User', () => {
    beforeEach(() => {
        // Clean DB before each test
        db.flushdb();
    });

    describe('Create', () => {
        it('should create a new user', (done) => {
            const user = {
                username: 'sergkudinov',
                firstname: 'Sergei',
                lastname: 'Kudinov'
            };

            userController.create(user, (err, result) => {
                expect(err).to.be.equal(null);
                expect(result).to.be.equal('OK');
                done();
            });
        });

        it('should not create a user with missing parameters', (done) => {
            const user = {
                firstname: 'Sergei',
                lastname: 'Kudinov'
            };

            userController.create(user, (err, result) => {
                expect(err).to.not.equal(null);
                expect(result).to.be.equal(null);
                done();
            });
        });
    });

    describe('Get', () => {
        it('should get a user by username', (done) => {
            const user = {
                username: 'johndoe',
                firstname: 'John',
                lastname: 'Doe'
            };

            // First, create a user to make sure the test is independent
            userController.create(user, (err, result) => {
                expect(err).to.be.equal(null);
                expect(result).to.be.equal('OK');

                // Then, try to get the user
                userController.get('johndoe', (err, retrievedUser) => {
                    expect(err).to.be.equal(null);
                    expect(retrievedUser).to.have.property('firstname', 'John');
                    expect(retrievedUser).to.have.property('lastname', 'Doe');
                    done();
                });
            });
        });

        it('should return an error when user does not exist', (done) => {
            userController.get('nonexistentuser', (err, retrievedUser) => {
                expect(err).to.not.equal(null);
                expect(err.message).to.be.equal('User not found');
                expect(retrievedUser).to.be.equal(null);
                done();
            });
        });
    });
});
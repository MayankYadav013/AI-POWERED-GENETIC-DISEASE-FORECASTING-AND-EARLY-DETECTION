const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany({});
});

describe('Auth Endpoints', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should fail to register if user exists', async () => {
        await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });

        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser2',
            email: 'test@example.com',
            password: 'password123'
        });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'User already exists');
    });

    it('should login successfully', async () => {
        await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});

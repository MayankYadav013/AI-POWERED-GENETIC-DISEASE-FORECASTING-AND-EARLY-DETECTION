const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;
let token;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(mongoUri);

    // Create a user and get a token
    const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    });
    token = res.body.token;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Predict Endpoints', () => {
    it('should reject unauthorized requests', async () => {
        const res = await request(app).post('/api/predict').send({});
        expect(res.statusCode).toEqual(401);
    });

    it('should require a payload', async () => {
        const res = await request(app)
            .post('/api/predict')
            .set('x-auth-token', token)
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'Prediction payload is required');
    });

    // We can't easily test a successful prediction without mocking axios inside the route
    // But this test ensures the route requires authentication and a payload.
});

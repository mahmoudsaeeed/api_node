const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user_model');
const usersRouter = require('../routes/user_routes/user_routes');

// Mock JSON Web Token
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-jwt-token'),
}));

// Mock userModel functions
jest.mock('../models/user_model');

const app = express();
app.use(express.json());
app.use(usersRouter);

describe('login', ()=>{
  
})
describe('Users Controller Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // تفريغ الموكات بعد كل اختبار
  });

  // ✅ 1. login - success
  it('should return token when login is successful', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: '123456'
    };

    userModel.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'fake-jwt-token');
    expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser._id, email: mockUser.email }, process.env.SECRET_KEY);
  });

  // ✅ 2. signup - success
  it('should create a new user and return a token', async () => {
    userModel.findOne.mockResolvedValue(null); // لا يوجد مستخدم مسجل
    userModel.prototype.save = jest.fn().mockResolvedValue(true);

    const res = await request(app)
      .post('/signup')
      .send({
        email: 'new@example.com',
        password: '123456',
        firstName: 'Test',
        lastName: 'User',
        mobileNumber: '0123456789',
        gender: 'male',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token', 'fake-jwt-token');
  });

});

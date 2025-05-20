const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app'); 
const userModel = require('../models/user_model');
const productModel = require('../models/product_model');

require('dotenv').config({ path: '.env' });

let token;


beforeEach(async () => {
await mongoose.connect(process.env.MONGO_DB);
await userModel.deleteMany({});

  const user = await userModel.create({
    email: 'youssef@gmail.com',
    password: '123456',
    firstName: 'youssef',
    lastName: 'omar',
    mobileNumber: '1234567890',
    gender: 'male'
  });

 
  const res = await request(app)
    .post('/api/login')
    .send({ email: 'youssef@gmail.com', password: '123456' });

  token = res.body.token;

  await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'laptop product',
        price: 2500,
        imageUrl: 'https://www.google.com/imgres?q=product%20images&imgurl=https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fphotography-product-download.jpg%3Fwidth%3D1000%26format%3Dpjpg%26exif%3D0%26iptc%3D0&imgrefurl=https%3A%2F%2Fwww.shopify.com%2Fstock-photos%2Fproduct&docid=ZjK9hSWWLAnTKM&tbnid=pqp-QtkRaStp0M&vet=12ahUKEwjG-_Hdo66NAxXUavEDHQqYNjkQM3oECEgQAA..i&w=1000&h=667&hcb=2&ved=2ahUKEwjG-_Hdo66NAxXUavEDHQqYNjkQM3oECEgQAA'
      });

});

afterAll(async () => {
  
  await mongoose.disconnect();
});

afterEach(async () => {
  await userModel.deleteMany();
    await productModel.deleteMany();
  
});

const userData = {
    email: 'mahmoud@gmail.com',
    password: '123456',
    firstName: 'mahmoud',
    lastName: 'saeed',
    mobileNumber: '01012347586',
    gender: 'male'
  };

//user integration testing

describe("get all users test", () =>{
it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
});

});

describe('User Integration Tests', () => {
 
  it('should signup a new user and return a token', async () => {
    const res = await request(app).post('/api/signup').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should not allow signup with existing email', async () => {
    await request(app).post('/api/signup').send(userData);
    const res = await request(app).post('/api/signup').send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email already exists/);
  });

  it('can not create a new user and return a token', async () => {
    const res = await (await request(app).post('/api/signup')).create({
    email: 'turky@gmail.com',
    password: 'vscode',
    firstName: 'turky',
    lastName: 'tharwat',

    });

   expect(res.statusCode).toBe(500);
   expect(res.body.message).toMatch(/'Server error/);

  });



});
  describe("login test", () =>{

    it('should login existing user and return a token', async () => {
    await request(app).post('/api/signup').send(userData);
    const res = await request(app).post('/api/login').send({
      email: userData.email,
      password: userData.password,
    });
    const Res=res.body.token;
    const fes = await request(app)
  .get('/api/products')
  .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    await request(app).post('/api/signup').send(userData);
    const res = await request(app).post('/api/login').send({
      email: userData.email,
      password: 'wrongpass',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Invalid credentials/);
  });

  
  it('should not login with wrong email', async () => {
    await request(app).post('/api/signup').send(userData);
    const res = await request(app).post('/api/login').send({
      email: "wrongEmail",
      password: userData.password,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email is not registered/);
  });
   
 
  it('should return server error', async () => {
    
    const res = await request(app).post('/api/login').send({
      email:"turky",
      password:userData.password,
    });
   expect(res.statusCode).toBe(500);
   expect(res.body.message).toMatch(/'Server error/);

  });
   

});
  
describe("fetch user test", () =>{
 it('should fetch users with valid token', async () => {
    await request(app).post('/api/signup').send(userData);
    const loginRes = await request(app).post('/api/login').send({
      email: userData.email,
      password: userData.password,
      
    });
const foundUser = res.body.find((u) => u.email === userData.email);


    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].email).toBe(userData.email);
  });

  it('should not fetch users with invalid token', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer invalidtoken`);

    expect(res.statusCode).toBe(403);
  });

});
 


//product integration testing 

describe('Product Controller Integration Tests', () => {

  it('should add a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'camera product',
        price: 1500,
        imageUrl: 'https://www.pexels.com/photo/black-fujifilm-dslr-camera-90946/'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('camera product');
  });
  
  
  it('can not add a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name:'camera product',
        price: "youssef@gmail.com",
        imageUrl:'https://www.pexels.com/photo/black-fujifilm-dslr-camera-90946/'
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/Internal server error/);
  });


 }); 
describe("get all products test", () =>{
it('should fetch all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

it('can not  fetch all products', async () => {
    const res = await request(app)
      .get('/api/products/camera')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/Failed to fetch products/);
   
  });


});
  

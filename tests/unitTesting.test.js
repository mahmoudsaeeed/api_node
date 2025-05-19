const jwt = require('jsonwebtoken');
const authunticateToken = require('../middleware/auth_middleware'); 

jest.mock('jsonwebtoken');  // عشان نقدر نتحكم في verify

describe('authunticateToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {

    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn()
    };
    next = jest.fn();
  });

  test('should return 401 if no token provided', () => {
    req.headers['authorization'] = null;

    authunticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'token is null and authHeader = null'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 if token is invalid', () => {
    req.headers['authorization'] = 'Bearer invalidtoken';

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    authunticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('invalidtoken', process.env.SECRET_KEY, expect.any(Function));
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next and attach user to req if token is valid', () => {
    req.headers['authorization'] = 'Bearer validtoken';

    const userPayload = { id: '123', name: 'Test User' };

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, userPayload);
    });

    authunticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.SECRET_KEY, expect.any(Function));
    expect(req.user).toEqual(userPayload);
    expect(next).toHaveBeenCalled();
  });
});


import { expect } from 'chai';  // Import 'expect' from chai
import authMiddleware from '../middleware/auth.js';  // Import the middleware function
import sinon from 'sinon';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', function () {
  it('should throw an error if no authorization header is present', function () {
    // Create a mock request object where 'get' returns null
    const req = {
      get: function (headerName) {
        return null;  // No Authorization header
      }
    };

    // Check if the middleware function throws the 'Not authenticated.' error when no header is present
    expect(() => authMiddleware(req, {}, () => {})).to.throw('Not authenticated.');
  });
});


describe('Auth Middleware', () => {

  afterEach(() => {
    sinon.restore(); // Reset sinon after each test to avoid interference
  });

  it('should check if jwt.verify is called', () => {
    const req = {
      get: function(headerName) {
        return 'Bearer validToken';
      }
    };

    const res = {};
    const next = () => {};

    // Create a spy on jwt.verify to check if it is called
    const jwtVerifySpy = sinon.spy(jwt, 'verify');

    // Call the middleware
    authMiddleware(req, res, next);

    // Check if jwt.verify was called once
    expect(jwtVerifySpy.calledOnce).to.be.true;

    // Check if jwt.verify was called with the correct token and secret
    expect(jwtVerifySpy.calledWith('validToken', 'someSupersecretxyz')).to.be.true;
  });
});
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'someSupersecretxyz');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  
  // Add decoded token to request for further use
 
  req.user = {
    userId: decodedToken.id ,// Adjust this based on your actual token payload
    role: decodedToken.role
  };

  console.log('User attached to req:', req.user);
  
  next();
};

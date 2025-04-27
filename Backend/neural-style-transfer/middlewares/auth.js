const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header('Authorization');
  
  // Check if the Authorization header is missing
  if (!authHeader) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }
  
  // Extract the token from the Authorization header
  const token = authHeader.replace('Bearer ', '');
  
  // Check if the token is missing
  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    // Attach the decoded token to the request object
    req.user = decoded;
    // Proceed to the next middleware or route handler
    next();
  } catch (ex) {
    // Handle invalid token error
    res.status(400).send({ error: 'Invalid token.' });
  }
};

module.exports = auth;

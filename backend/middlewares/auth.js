const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET || 'secret'; // fallback


function generateToken(userId) {
  return jwt.sign({ userId }, secret_key, { expiresIn: '1h' });
}


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Missing or invalid auth header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret_key);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token verification failed' }); 
  }
};

module.exports = { authMiddleware, generateToken, secret_key };



import jwt from 'jsonwebtoken';
import { Store } from '../services/store.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'swiggy_super_secret_jwt_key_2025');
      const user = await Store.findUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found or authorization failed' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'restaurant_partner')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin or Partner rights required' });
  }
};


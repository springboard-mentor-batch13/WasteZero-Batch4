import jwt from 'jsonwebtoken';

// Sign a JWT carrying the user id and role.
export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_one';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Authentication required: Username and password must be provided' });
  }

  try {
    const user = await UserModel.findByUsername(username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid TUC credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid TUC credentials' });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
    const token = jwt.sign(tokenPayload, JWT_SECRET, options);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      },
      message: 'TUC Central Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  // Client is expected to delete the token. 
  // Future implementation could involve blacklisting tokens in Redis.
  res.status(200).json({ success: true, message: 'Logout successful' });
};

export const validateToken = (req: Request, res: Response) => {
  res.status(200).json({ 
    success: true, 
    valid: true, 
    user: (req as any).user 
  });
};


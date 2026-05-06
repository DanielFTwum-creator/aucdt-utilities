import pool from '../utils/db';

export interface User {
  id: number;
  username: string;
  password?: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async findByUsername(username: string): Promise<User | null> {
    try {
      const [rows] = await (pool as any).execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0] as User;
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error;
    }
  }

  static async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await (pool as any).execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0] as User;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  static async create(userData: Partial<User>): Promise<number> {
    try {
      const { username, password, email, role } = userData;
      const [result] = await (pool as any).execute(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        [username, password, email, role || 'user']
      );
      return (result as any).insertId;
    } catch (error) {

      console.error('Error in create User:', error);
      throw error;
    }
  }
}


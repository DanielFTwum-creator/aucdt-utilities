import { getDb } from '@/db';
import { Request, Response } from 'express';

export const getSystemDiagnostics = (req: Request, res: Response) => {
  const db = getDb();
  
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const candidateCount = db.prepare('SELECT COUNT(*) as count FROM candidates').get() as { count: number };
    const roleCount = db.prepare('SELECT COUNT(*) as count FROM roles').get() as { count: number };
    const appCount = db.prepare('SELECT COUNT(*) as count FROM applications').get() as { count: number };
    
    const dbSize = fs.statSync(path.join(process.cwd(), 'talentverify.db')).size;

    res.json({
      status: 'healthy',
      database: {
        connected: true,
        size_bytes: dbSize,
        counts: {
          users: userCount.count,
          candidates: candidateCount.count,
          roles: roleCount.count,
          applications: appCount.count
        }
      },
      system: {
        uptime: process.uptime(),
        node_version: process.version,
        memory: process.memoryUsage()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
};

import fs from 'fs';
import path from 'path';

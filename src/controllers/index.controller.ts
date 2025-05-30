import { Request, Response } from 'express';

export const welcome = (req: Request, res: Response) => {
  res.json({ 
    message: 'your Welcome',
    status: 'OK', 
    uptime: process.uptime() 
  });
}
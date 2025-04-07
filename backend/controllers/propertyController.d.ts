declare module '../controllers/propertyController' {
  import { Request, Response, NextFunction } from 'express';

  export function placeholder(req: Request, res: Response): void;
  export function createProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
  export function updateProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
}
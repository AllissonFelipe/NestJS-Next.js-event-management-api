import { JwtPayLoad } from './jwt-payload';

export interface AuthRequest extends Request {
  user: JwtPayLoad;
}

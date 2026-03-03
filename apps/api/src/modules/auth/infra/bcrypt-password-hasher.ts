import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasherInterface } from '../application/create-account/password-hasher.interface';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasherInterface {
  private readonly saltRounds = 10;

  async hash(rawPassword: string): Promise<string> {
    return bcrypt.hash(rawPassword, this.saltRounds);
  }

  async compare(rawPassword: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashPassword);
  }
}

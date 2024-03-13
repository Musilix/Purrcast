import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  // TODO - maybe move some business logic from guards to here?
  async validateUser(username: string, password: string): Promise<any> {
    return null;
  }
}

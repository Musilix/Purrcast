import { Reflector } from '@nestjs/core';

export const WhoAmIFor = Reflector.createDecorator<string>();

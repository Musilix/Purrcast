import { Reflector } from '@nestjs/core';

export const CustomAuthMessage = Reflector.createDecorator<string>();

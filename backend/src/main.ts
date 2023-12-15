import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { __prod__ } from './constants';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: !__prod__
      ? ['http://localhost:3000', /\.localhost:3000\.com$/]
      : [
          'https://incandescent-stroopwafel-e0f3f8.netlify.app',
          /\.incandescent-stroopwafel-e0f3f8.netlify.app$/,
        ],
  });

  // TODO - change this address to private net IP
  await app.listen(8080, '0.0.0.0');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { load } from 'js-yaml';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './filter/exception.filter';
import { LoggingService } from './logging/logging.service';

const readApiYaml = async () => {
  const dstPath = resolve(__dirname, '..', 'doc', 'api.yaml');
  return await readFile(dstPath, 'utf-8');
};
dotenv.config();
async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const customLoggerService = app.get(LoggingService);
  const exceptionsFilter = new ExceptionsFilter(customLoggerService);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(exceptionsFilter);

  const apiConfig = await readApiYaml();
  const document = load(apiConfig) as OpenAPIObject;
  SwaggerModule.setup('/doc', app, document);

  process.on('unhandledRejection', (error) => {
    customLoggerService.error({
      message: 'Unhandled Rejection',
      trace: error instanceof Error ? error.stack : String(error),
      statusCode: 500,
    });

    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    customLoggerService.error({
      message: 'Uncaught Exception',
      trace: error.stack,
      statusCode: 500,
    });

    process.exit(1);
  });

  await app.listen(PORT);
}
bootstrap();

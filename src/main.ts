import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    disableErrorMessages:false,
  }))
  app.setGlobalPrefix("api")
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('Documentation of Blog API')
    .setVersion('1.0')
    .setBasePath("api")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  await app.listen(3000);
}
bootstrap();

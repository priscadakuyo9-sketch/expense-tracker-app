import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Diagnostic logs (retirer après résolution)
  console.log('[BOOT] NODE_ENV:', process.env.NODE_ENV);
  console.log('[BOOT] FRONTEND_URL:', process.env.FRONTEND_URL ?? '⚠️ NON DÉFINI — CORS bloquera le frontend');

  // Security
  app.use(helmet());
  // IMPORTANT: avec credentials:true, origin NE PEUT PAS être '*'
  // Définir FRONTEND_URL sur Render: ex. https://mon-app.vercel.app
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Doit être défini sur Render
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Global Pipes with strict validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Mobile Money Expense Tracker API')
    .setDescription('The expense tracker API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('expenses')
    .addTag('categories')
    .addTag('stats')
    .addTag('budgets')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[BOOT] ✅ Serveur démarré sur le port ${port}`);
}
bootstrap();

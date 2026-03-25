"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('[BOOT] NODE_ENV:', process.env.NODE_ENV);
    console.log('[BOOT] FRONTEND_URL:', process.env.FRONTEND_URL ?? '⚠️ NON DÉFINI — CORS bloquera le frontend');
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: process.env.FRONTEND_URL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`[BOOT] ✅ Serveur démarré sur le port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
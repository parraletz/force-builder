import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { envs } from './configs/envs'
import { otelSDK } from './tracing'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  await otelSDK.start()

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API built with NestJS')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  await app.listen(envs.PORT, '0.0.0.0')
  app.useLogger(app.get(Logger))
  const logger = app.get(Logger)

  logger.log(`App is running on port ${await app.getUrl()} 🚀`)
}
bootstrap().catch(handleError)

function handleError(error: unknown) {
  console.error(error)
  process.exit(1)
}

process.on('uncaughtException', handleError)

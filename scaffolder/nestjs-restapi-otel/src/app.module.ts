import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { context, trace } from '@opentelemetry/api'
import { OpenTelemetryModule } from 'nestjs-otel'
import { LoggerModule } from 'nestjs-pino'
import Pino, { Logger, LoggerOptions } from 'pino'
import { envs } from './configs/envs'
import { CorrelationIdMiddleware } from './correlation-id/correlation-id.middleware'
import { HealthModule } from './health/health.module'
import { ProductsModule } from './products/products.module'

const loggerOptions: LoggerOptions = {
  level: envs.LOG_LEVEL,
  messageKey: 'message',
  formatters: {
    level(label) {
      return { level: label }
    },
    log(object) {
      const span = trace.getSpan(context.active())
      if (!span) return { ...object }
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { spanId, traceId } = trace.getSpan(context.active())?.spanContext()
      return {
        ...object,
        spanId,
        traceId,
        span_id: spanId,
        trace_id: traceId
      }
    }
  }
}

const logger: Logger = Pino(loggerOptions)

@Module({
  imports: [
    ProductsModule,
    HealthModule,
    LoggerModule.forRoot({
      pinoHttp: {
        logger: logger
      }
    }),
    OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: true,
        apiMetrics: {
          enable: true,
          ignoreRoutes: ['/health', '/metrics', '/favicon.ico'],
          ignoreUndefinedRoutes: false
        }
      }
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*')
  }
}

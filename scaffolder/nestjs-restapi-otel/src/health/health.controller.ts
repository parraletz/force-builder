import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator
} from '@nestjs/terminus'
import { Span, TraceService } from 'nestjs-otel'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService, //eslint-disable-line
    private memory: MemoryHealthIndicator, //eslint-disable-line
    private http: HttpHealthIndicator, //eslint-disable-line
    private readonly traceService: TraceService //eslint-disable-line
  ) {}

  @Span()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.http.pingCheck('service', 'https://httpbin.org/get')
    ])
  }
}

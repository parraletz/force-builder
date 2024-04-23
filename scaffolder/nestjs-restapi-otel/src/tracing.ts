import { Span } from '@opentelemetry/api'
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator
} from '@opentelemetry/core'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import {
  FastifyInstrumentation,
  FastifyRequestInfo
} from '@opentelemetry/instrumentation-fastify'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3'
import { Resource } from '@opentelemetry/resources'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION
} from '@opentelemetry/semantic-conventions'

export const otelSDK = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'nestjs-api',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0.0'
  }),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({})
  }),
  traceExporter: new OTLPTraceExporter({}),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER })
    ]
  }),

  instrumentations: [
    new PinoInstrumentation(),
    new FastifyInstrumentation({
      requestHook: function (span: Span, info: FastifyRequestInfo) {
        span.setAttribute('http.method', info.request.method)
      }
    }),
    new HttpInstrumentation()
  ]
})

process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(() => {
      console.log('SDK shutdown complete'),
        (err) => console.log('Error shutting down SDK', err) // eslint-disable-line
    })
    .finally(() => process.exit(0))
})

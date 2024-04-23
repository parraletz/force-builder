import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { v4 as uuid } from 'uuid'

export const CORRELATION_ID_HEADER = 'x-correlation-id'

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply['raw'], next: () => void) {
    const id = uuid()
    req.headers[CORRELATION_ID_HEADER] = id
    res.setHeader(CORRELATION_ID_HEADER, id)
    next()
  }
}

import 'dotenv/config'
import * as joi from 'joi'

interface IEnv {
  PORT: number
  NODE_ENV: string
  LOG_LEVEL?: string
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().default(3000).required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development')
      .required()
  })
  .unknown()

const { error, value } = envVarsSchema.validate(process.env)

const envVars: IEnv = value

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const envs = {
  PORT: envVars.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: envVars.LOG_LEVEL || 'info'
}

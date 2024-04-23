#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import 'source-map-support/register'
import { LambdaLocalStack } from '../lib/lambda-local-stack'

const app = new cdk.App()
new LambdaLocalStack(app, 'LambdaLocalStack', {})

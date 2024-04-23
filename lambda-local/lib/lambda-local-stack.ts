import * as cdk from 'aws-cdk-lib'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'

export class LambdaLocalStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambda = new NodejsFunction(this, 'Lambda', {
      entry: 'lambda/hello.ts',
      handler: 'handler',
      environment: {
        MY_ENV_VAR: 'Hello, CDK!'
      }
    })
  }
}

import { Serverless } from 'serverless/aws';
import { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD, TOPIC_NAME, CATALOG_ITEMS_QUEUE_ARN } from './config';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'products-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: {
        Ref: "SNSTopic"
      },
      PG_HOST,
      PG_PORT,
      PG_DATABASE,
      PG_USERNAME,
      PG_PASSWORD
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: CATALOG_ITEMS_QUEUE_ARN
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: {
          Ref: "SNSTopic"
        }
      }
    ]
  },
  resources: {
    Resources: {
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: TOPIC_NAME
        }
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "aliaksandr.hordzin@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic"
          }
        }
      }
    }
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: CATALOG_ITEMS_QUEUE_ARN
          }
        }
      ]
    },
    getApiDoc: {
      handler: 'handler.getApiDoc',
      events: [
        {
          http: {
            method: 'get',
            path: 'api-doc',
            cors: true
          }
        }
      ]
    }
  }
};

module.exports = serverlessConfiguration;

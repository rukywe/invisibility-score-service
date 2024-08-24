# Project Overview

The Invisibility Score Service is a serverless application built with AWS Lambda that calculates an invisibility score based on a user's superhero score and personal data. The service stores the results in an S3 bucket as CSV files and provides an API to retrieve and download these files.

## Features

- Calculates invisibility score based on superhero test score and user data
- Retrieves random user data from an external API
- Stores results in AWS S3 as CSV files
- Implements API key protection and request throttling
- Provides an endpoint to list stored CSV files with pre-signed URLs
- Input validation
- Implements custom error handling
- Fully Implemented CI/CD pipeline for automated testing and deployment

## API Security

This service uses Amazon API Gateway for request handling and implements API key authentication for route protection. This ensures that only authorized clients with valid API keys can access the endpoints.

### API Key Setup

1. API keys are managed through the AWS Console or via the Serverless Framework configuration.
2. To use the API, clients must include the API key in the `x-api-key` header of their requests.

### Usage Plan

The service implements a usage plan with the following limits:

- Burst Limit: 20 requests
- Rate Limit: 10 requests per second
- Quota: 1000 requests per month

This configuration helps prevent abuse and ensures fair usage of the service.

## Tech used

- Node.js with TypeScript
- AWS Lambda
- Amazon API Gateway
- Amazon S3
- Serverless Framework

## Local Development

Run the service locally:

```
npm install
npm run start
```

This will compile TypeScript files and start the service using serverless-offline.

## Testing

Run the test suite:

```
npm test
```

## API Endpoints

1. POST /superhero

   - Calculates invisibility score
   - Requires API key
   - Required Param - `superheroScore`
   - Example request body: `{ "superheroScore": 75 }

```
curl -X POST https://2ik7i2n54l.execute-api.us-east-1.amazonaws.com/dev/superhero \
  -H "Content-Type: application/json" \
  -H "x-api-key: api-key-value" \
  -d '{"superheroScore": 75}'
```

2. GET /list-csvs
   - Lists stored CSV files with pre-signed URLs
   - Requires API key
   - No params required

```
curl -XGET -H 'x-api-key: api-key-value' -H "Content-type: application/json" 'https://2ik7i2n54l.execute-api.us-east-1.amazonaws.com/dev/list-csvs
```

## CSV Listing Functionality

The CSV listing endpoint allows users to retrieve a list of stored result files.

- S3 bucket listing
- Generation of pre-signed URLs for secure, time-limited access

To enhance the CSV listing functionality, we could implement pagination as this would allow clients to specify the number of results per page and improve performance for buckets with a large number of files

## CI/CD Pipeline

The project includes a fully automated CI/CD pipeline that:

- Runs tests on every push
- Deploys to AWS on successful test completion
- Ensures code quality and consistent deployments

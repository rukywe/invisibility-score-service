import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import logger from './utils/logger';

export const listCSVsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Received request to list CSV files');

  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    const stage = process.env.STAGE;

    logger.info(`list files in bucket: ${bucketName}, stage: ${stage}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'List CSVs' })
    };
  } catch (error) {
    logger.error('Error in listCSVsHandler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

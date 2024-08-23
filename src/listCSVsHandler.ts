import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import logger from './utils/logger';

const s3Client = new S3Client({});

export const listCSVsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Received request to list CSV files');

  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    const stage = process.env.STAGE;

    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME environment variable is not set');
    }

    logger.info(`Listing files in bucket: ${bucketName}, stage: ${stage}`);

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `${stage}/results/`
    });

    const data = await s3Client.send(command);
    const files = data.Contents || [];

    return {
      statusCode: 200,
      body: JSON.stringify({ files: files.map((file) => file.Key) })
    };
  } catch (error) {
    logger.error('Error in listCSVsHandler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to list CSV files' })
    };
  }
};

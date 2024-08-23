import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { parse } from 'json2csv';
import { generateS3Key, ResultData } from './helpers';
import logger from '../utils/logger';

const s3Client = new S3Client({});

export const saveResultToCSV = async (result: ResultData): Promise<void> => {
  const bucketName = process.env.S3_BUCKET_NAME;
  const stage = process.env.STAGE;

  if (!bucketName) {
    logger.warn(
      'S3_BUCKET_NAME environment variable is not set. Skipping S3 upload.'
    );
    return;
  }

  if (process.env.IS_OFFLINE === 'true') {
    logger.info('Running offline. Skipping S3 upload.');
    return;
  }

  try {
    const csvData = {
      name: `${result.userData.name.first} ${result.userData.name.last}`,
      email: result.userData.email,
      age: result.userData.dob.age,
      gender: result.userData.gender,
      superheroScore: result.superheroScore,
      invisibilityScore: result.invisibilityScore,
      invisibilityStatus: result.invisibilityStatus
    };

    const csvContent = parse([csvData]);
    const uniqueKey = `${stage}/${generateS3Key()}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      Body: csvContent,
      ContentType: 'text/csv'
    });

    await s3Client.send(command);
  } catch (error) {
    logger.error('Error saving CSV to S3:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save result to S3: ${error.message}`);
    } else {
      throw new Error('Failed to save result to S3: Unknown error');
    }
  }
};

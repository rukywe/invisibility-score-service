import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  getUserData,
  calculateInvisibilityScore,
  normalizeScore,
  getInvisibilityStatus,
  ResultData,
  UserData
} from './utils/helpers';
import { saveResultToCSV } from './utils/s3Operations';
import logger from './utils/logger';
import { CustomError, ValidationError } from './utils/error';

export const superheroHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new ValidationError('Missing request body.');
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      throw new ValidationError('Invalid JSON in request body.');
    }

    if (!('superheroScore' in parsedBody)) {
      throw new ValidationError('Missing superheroScore in request body.');
    }

    const { superheroScore } = parsedBody;

    if (typeof superheroScore !== 'number') {
      throw new ValidationError(
        'Invalid superhero score. Must be a number between 0 and 100.'
      );
    }

    if (superheroScore < 0 || superheroScore > 100) {
      throw new ValidationError(
        'Invalid superhero score. Must be a number between 0 and 100.'
      );
    }

    const fullUserData = await getUserData();
    const rawScore = calculateInvisibilityScore(
      superheroScore,
      fullUserData.dob.age,
      fullUserData.gender
    );
    const normalizedScore = normalizeScore(rawScore);
    const status = getInvisibilityStatus(normalizedScore);

    const filteredUserData: UserData = {
      gender: fullUserData.gender,
      name: {
        first: fullUserData.name.first,
        last: fullUserData.name.last
      },
      email: fullUserData.email,
      dob: {
        age: fullUserData.dob.age
      }
    };

    const result: ResultData = {
      superheroScore,
      invisibilityScore: parseFloat(normalizedScore.toFixed(2)),
      invisibilityStatus: status,
      userData: filteredUserData
    };

    await saveResultToCSV(result);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Error:', error);
    if (error instanceof CustomError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  }
};

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

export const superheroHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { superheroScore } = JSON.parse(event.body || '{}');

    if (
      typeof superheroScore !== 'number' ||
      superheroScore < 0 ||
      superheroScore > 100
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid superhero score. Must be a number between 0 and 100.'
        })
      };
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
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

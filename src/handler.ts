import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  getUserData,
  calculateInvisibilityScore,
  normalizeScore,
  getInvisibilityStatus
} from './utils/helpers';

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

    const userData = await getUserData();
    const rawScore = calculateInvisibilityScore(
      superheroScore,
      userData.dob.age,
      userData.gender
    );
    const normalizedScore = normalizeScore(rawScore);
    const status = getInvisibilityStatus(normalizedScore);

    return {
      statusCode: 200,
      body: JSON.stringify({
        superheroScore,
        invisibilityScore: normalizedScore.toFixed(2),
        invisibilityStatus: status,
        userData: {
          age: userData.dob.age,
          gender: userData.gender
        }
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

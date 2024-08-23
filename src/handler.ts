import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

interface UserData {
  gender: string;
  dob: {
    age: number;
  };
}

const getUserData = async (): Promise<UserData> => {
  const response = await axios.get('https://randomuser.me/api/');
  return response.data.results[0];
};

const calculateInvisibilityScore = (
  superheroScore: number,
  age: number,
  gender: string
): number => {
  const genderWeighting = gender === 'male' ? 5 : 8;
  return genderWeighting * (superheroScore - age);
};

const normalizeScore = (score: number): number => {
  const minScore = -500;
  const maxScore = 800;
  const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
  return Math.max(0, Math.min(100, normalizedScore));
};

const getInvisibilityStatus = (score: number): string => {
  if (score < 20) return 'Not invisible';
  if (score < 40) return 'Camouflage';
  if (score < 60) return 'Translucent';
  if (score < 80) return 'Transparent';
  return 'Invisible';
};

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

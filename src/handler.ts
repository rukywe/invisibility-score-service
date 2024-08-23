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

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Superhero score received and user data fetched!',
        superheroScore,
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

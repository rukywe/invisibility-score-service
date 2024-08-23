import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const superheroHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Request received:', event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Superhero score received!',
      input: event
    })
  };
};

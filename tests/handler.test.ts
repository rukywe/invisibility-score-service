import { APIGatewayProxyEvent } from 'aws-lambda';
import { superheroHandler } from '../src/handler';
import * as helpers from '../src/utils/helpers';
import * as s3Operations from '../src/utils/s3Operations';

jest.mock('../src/utils/helpers');
jest.mock('../src/utils/s3Operations');
jest.mock('../src/utils/logger');

describe('superheroHandler', () => {
  const mockUserData = {
    gender: 'male',
    name: { first: 'John', last: 'Doe' },
    email: 'john.doe@example.com',
    dob: { age: 30 }
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (helpers.getUserData as jest.Mock).mockResolvedValue(mockUserData);
    (helpers.calculateInvisibilityScore as jest.Mock).mockReturnValue(200);
    (helpers.normalizeScore as jest.Mock).mockReturnValue(50);
    (helpers.getInvisibilityStatus as jest.Mock).mockReturnValue('Translucent');
    (s3Operations.saveResultToCSV as jest.Mock).mockResolvedValue(undefined);
  });

  it('returns a successful response with correct data', async () => {
    const mockEvent = {
      body: JSON.stringify({ superheroScore: 75 })
    } as APIGatewayProxyEvent;

    const response = await superheroHandler(mockEvent);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      superheroScore: 75,
      invisibilityScore: 50,
      invisibilityStatus: 'Translucent',
      userData: mockUserData
    });
  });

  it('returns an error for invalid superhero score', async () => {
    const mockEvent = {
      body: JSON.stringify({ superheroScore: 150 })
    } as APIGatewayProxyEvent;

    const response = await superheroHandler(mockEvent);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Invalid superhero score. Must be a number between 0 and 100.'
    });
  });

  it('handles missing body gracefully', async () => {
    const mockEvent = {} as APIGatewayProxyEvent;

    const response = await superheroHandler(mockEvent);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Invalid superhero score. Must be a number between 0 and 100.'
    });
  });

  it('calls saveResultToCSV with correct data', async () => {
    const mockEvent = {
      body: JSON.stringify({ superheroScore: 75 })
    } as APIGatewayProxyEvent;

    await superheroHandler(mockEvent);

    expect(s3Operations.saveResultToCSV).toHaveBeenCalledWith({
      superheroScore: 75,
      invisibilityScore: 50,
      invisibilityStatus: 'Translucent',
      userData: mockUserData
    });
  });

  it('returns 500 error when an unexpected error occurs', async () => {
    (helpers.getUserData as jest.Mock).mockRejectedValue(
      new Error('API error')
    );

    const mockEvent = {
      body: JSON.stringify({ superheroScore: 75 })
    } as APIGatewayProxyEvent;

    const response = await superheroHandler(mockEvent);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Internal server error'
    });
  });
});

import {
  getUserData,
  calculateInvisibilityScore,
  normalizeScore,
  getInvisibilityStatus
} from '../src/utils/helpers';
import axios from 'axios';

jest.mock('axios');

describe('Helper Functions', () => {
  describe('calculateInvisibilityScore', () => {
    it('calculates invisibility score correctly for male', () => {
      const score = calculateInvisibilityScore(50, 30, 'male');
      expect(score).toBe(100);
    });

    it('calculates invisibility score correctly for female', () => {
      const score = calculateInvisibilityScore(50, 30, 'female');
      expect(score).toBe(160);
    });
  });

  describe('normalizeScore', () => {
    it('normalizes the score correctly within the range', () => {
      const normalized = normalizeScore(0);
      expect(normalized).toBeCloseTo(38.46, 2);
    });

    it('clamps the score to 0 if below minimum', () => {
      const normalized = normalizeScore(-600);
      expect(normalized).toBe(0);
    });

    it('clamps the score to 100 if above maximum', () => {
      const normalized = normalizeScore(900);
      expect(normalized).toBe(100);
    });
  });

  describe('getInvisibilityStatus', () => {
    it('returns "Not invisible" for scores below 20', () => {
      const status = getInvisibilityStatus(10);
      expect(status).toBe('Not invisible');
    });

    it('returns "Invisible" for scores above 80', () => {
      const status = getInvisibilityStatus(85);
      expect(status).toBe('Invisible');
    });
  });

  describe('getUserData', () => {
    it('fetches user data successfully', async () => {
      const mockData = {
        results: [
          {
            gender: 'male',
            name: { first: 'Kel', last: 'Vin' },
            email: 'kel.vin@example.com',
            dob: { age: 30 }
          }
        ]
      };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

      const userData = await getUserData();
      expect(userData).toEqual(mockData.results[0]);
    });

    it('handles API failure gracefully', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(getUserData()).rejects.toThrow('Failed to fetch user data.');
    });
  });
});

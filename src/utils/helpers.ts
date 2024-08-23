import axios from 'axios';

export interface UserData {
  gender: string;
  dob: {
    age: number;
  };
}

export const getUserData = async (): Promise<UserData> => {
  const response = await axios.get('https://randomuser.me/api/');
  return response.data.results[0];
};

export const calculateInvisibilityScore = (
  superheroScore: number,
  age: number,
  gender: string
): number => {
  const genderWeighting = gender === 'male' ? 5 : 8;
  return genderWeighting * (superheroScore - age);
};

export const normalizeScore = (score: number): number => {
  const minScore = -500;
  const maxScore = 800;
  const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
  return Math.max(0, Math.min(100, normalizedScore));
};

export const getInvisibilityStatus = (score: number): string => {
  if (score < 20) return 'Not invisible';
  if (score < 40) return 'Camouflage';
  if (score < 60) return 'Translucent';
  if (score < 80) return 'Transparent';
  return 'Invisible';
};

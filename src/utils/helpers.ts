import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

export interface UserData {
  gender: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  dob: {
    age: number;
  };
}

export interface ResultData {
  superheroScore: number;
  invisibilityScore: number;
  invisibilityStatus: string;
  userData: UserData;
}

export const getUserData = async (): Promise<UserData> => {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    return response.data.results[0];
  } catch (error) {
    logger.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data.');
  }
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

export const generateS3Key = (): string => {
  const date = new Date();
  const dateString = date.toLocaleDateString().replace(/\//g, '-');
  const timeString = date.toLocaleTimeString().replace(/:/g, '-');
  return `results/${dateString}-${timeString}-${uuidv4()}.csv`;
};

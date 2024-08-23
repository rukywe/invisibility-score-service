"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superheroHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const getUserData = async () => {
    const response = await axios_1.default.get('https://randomuser.me/api/');
    return response.data.results[0];
};
const calculateInvisibilityScore = (superheroScore, age, gender) => {
    const genderWeighting = gender === 'male' ? 5 : 8;
    return genderWeighting * (superheroScore - age);
};
const normalizeScore = (score) => {
    const minScore = -500;
    const maxScore = 800;
    const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
    return Math.max(0, Math.min(100, normalizedScore));
};
const getInvisibilityStatus = (score) => {
    if (score < 20)
        return 'Not invisible';
    if (score < 40)
        return 'Camouflage';
    if (score < 60)
        return 'Translucent';
    if (score < 80)
        return 'Transparent';
    return 'Invisible';
};
const superheroHandler = async (event) => {
    try {
        const { superheroScore } = JSON.parse(event.body || '{}');
        if (typeof superheroScore !== 'number' ||
            superheroScore < 0 ||
            superheroScore > 100) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid superhero score. Must be a number between 0 and 100.'
                })
            };
        }
        const userData = await getUserData();
        const rawScore = calculateInvisibilityScore(superheroScore, userData.dob.age, userData.gender);
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
    }
    catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
exports.superheroHandler = superheroHandler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superheroHandler = void 0;
const helpers_1 = require("./utils/helpers");
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
        const userData = await (0, helpers_1.getUserData)();
        const rawScore = (0, helpers_1.calculateInvisibilityScore)(superheroScore, userData.dob.age, userData.gender);
        const normalizedScore = (0, helpers_1.normalizeScore)(rawScore);
        const status = (0, helpers_1.getInvisibilityStatus)(normalizedScore);
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

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

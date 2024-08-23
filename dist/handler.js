"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superheroHandler = void 0;
const superheroHandler = async (event) => {
    console.log('Request received:', event);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Superhero score received!',
            input: event
        })
    };
};
exports.superheroHandler = superheroHandler;

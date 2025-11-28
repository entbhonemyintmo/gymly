import ky from 'ky';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'gymly_token';

export const api = ky.create({
    prefixUrl: API_BASE_URL,
    hooks: {
        beforeRequest: [
            (request) => {
                const token = localStorage.getItem(TOKEN_KEY);
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                }
            },
        ],
    },
});

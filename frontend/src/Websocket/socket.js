import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
export const SERVER_URL = 'http://localhost:8000';

export const socket = io(SERVER_URL, { autoConnect: false });



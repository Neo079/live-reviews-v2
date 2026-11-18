import { createServer } from 'node:http';
import { createApp } from './app.js';
import { createReviewStore } from './db.js';
import { attachWebSocket } from './websocket.js';

const PORT = process.env.PORT ?? 4000;
const DB_FILE = process.env.DB_FILE ?? 'reviews.db';

const store = createReviewStore(DB_FILE);

// The HTTP server is created first so the WebSocket server can share it;
// the app only needs the resulting `broadcast` function.
const server = createServer();
const { broadcast } = attachWebSocket(server);
server.on('request', createApp({ store, broadcast }));

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`WebSocket on ws://localhost:${PORT}/ws`);
});

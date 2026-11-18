import { WebSocket, WebSocketServer } from 'ws';

/**
 * Attaches a WebSocket server to the HTTP server and returns a
 * `broadcast` function that sends an event to every connected client.
 */
export function attachWebSocket(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  function broadcast(event) {
    const message = JSON.stringify(event);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) client.send(message);
    }
  }

  return { wss, broadcast };
}

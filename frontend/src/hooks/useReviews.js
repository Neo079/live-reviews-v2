import { useEffect, useState } from 'react';
import { getReviews } from '../api/reviewsApi.js';
import { applyEvent } from '../utils/reviewList.js';

const RECONNECT_DELAY_MS = 2000;

const socketUrl = () =>
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`;

/**
 * Loads all reviews once, then keeps them in sync through the
 * WebSocket. Reconnects automatically and refetches on reconnect so
 * no events are missed while the socket was down.
 */
export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let socket;
    let reconnectTimer;
    let closed = false;

    const load = () =>
      getReviews()
        .then((data) => {
          if (closed) return;
          setReviews(data);
          setError(null);
        })
        .catch((err) => !closed && setError(err.message))
        .finally(() => !closed && setLoading(false));

    const connect = () => {
      socket = new WebSocket(socketUrl());
      socket.onopen = load;
      socket.onmessage = (message) => {
        const event = JSON.parse(message.data);
        setReviews((current) => applyEvent(current, event));
      };
      socket.onclose = () => {
        if (!closed) reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };
    };

    connect();

    return () => {
      closed = true;
      clearTimeout(reconnectTimer);
      socket.close();
    };
  }, []);

  return { reviews, loading, error };
}

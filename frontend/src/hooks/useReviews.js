import { useEffect, useRef, useState } from 'react';
import { getReviews } from '../api/reviewsApi.js';
import { applyEvent } from '../utils/reviewList.js';

const RECONNECT_DELAY_MS = 2000;
const HIGHLIGHT_MS = 3000;

// Which highlight each live event produces (restored counts as added).
const HIGHLIGHT_FOR_EVENT = {
  created: 'created',
  restored: 'created',
  updated: 'updated',
  deleted: 'deleted',
};

const socketUrl = () =>
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`;

const withoutKey = (object, key) => {
  const copy = { ...object };
  delete copy[key];
  return copy;
};

/**
 * Loads all reviews once, then keeps them in sync through the
 * WebSocket. Reconnects automatically and refetches on reconnect so
 * no events are missed while the socket was down.
 *
 * `highlights` maps a review id to 'created' | 'updated' | 'deleted'
 * for 3 seconds after the matching live event. A deleted review stays
 * in the list for that time and is removed when its highlight ends.
 */
export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [highlights, setHighlights] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timers = useRef({});

  useEffect(() => {
    let socket;
    let reconnectTimer;
    let closed = false;
    const highlightTimers = timers.current;

    const load = () =>
      getReviews()
        .then((data) => {
          if (closed) return;
          setReviews(data);
          setError(null);
        })
        .catch((err) => !closed && setError(err.message))
        .finally(() => !closed && setLoading(false));

    const handleEvent = (event) => {
      const highlight = HIGHLIGHT_FOR_EVENT[event.type];
      if (!highlight) return;
      const { id } = event.review;

      // A newer event for the same review cancels its pending timer,
      // e.g. an undo arriving while the deleted row is still red.
      clearTimeout(highlightTimers[id]);

      if (highlight !== 'deleted') {
        setReviews((current) => applyEvent(current, event));
      }
      setHighlights((current) => ({ ...current, [id]: highlight }));

      highlightTimers[id] = setTimeout(() => {
        if (highlight === 'deleted') {
          setReviews((current) => applyEvent(current, event));
        }
        setHighlights((current) => withoutKey(current, id));
        delete highlightTimers[id];
      }, HIGHLIGHT_MS);
    };

    const connect = () => {
      socket = new WebSocket(socketUrl());
      socket.onopen = load;
      socket.onmessage = (message) => handleEvent(JSON.parse(message.data));
      socket.onclose = () => {
        if (!closed) reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };
    };

    connect();

    return () => {
      closed = true;
      clearTimeout(reconnectTimer);
      Object.values(highlightTimers).forEach(clearTimeout);
      socket.close();
    };
  }, []);

  return { reviews, highlights, loading, error };
}

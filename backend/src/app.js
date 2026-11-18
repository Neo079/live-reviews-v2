import { randomUUID } from 'node:crypto';
import express from 'express';
import { validateRestoreInput, validateReviewInput } from './validation.js';

/**
 * Builds the Express app. `store` persists reviews and `broadcast`
 * pushes live events to connected WebSocket clients; both are injected
 * so the app can be tested without a real socket server.
 */
export function createApp({ store, broadcast }) {
  const app = express();
  app.use(express.json());

  const router = express.Router();

  router.get('/', (_req, res) => {
    res.json(store.list());
  });

  // Registered before the '/:id' routes so "restore" is never read as an id.
  // Used by the undo-delete flow: re-inserts a review with its original
  // id and timestamp so it returns to its previous position.
  router.post('/restore', (req, res) => {
    const { value, error } = validateRestoreInput(req.body);
    if (error) return res.status(400).json({ error });
    if (store.get(value.id)) {
      return res.status(409).json({ error: 'Review already exists' });
    }

    const review = store.create(value);
    broadcast({ type: 'restored', review });
    res.status(201).json(review);
  });

  router.get('/:id', (req, res) => {
    const review = store.get(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  });

  router.post('/', (req, res) => {
    const { value, error } = validateReviewInput(req.body);
    if (error) return res.status(400).json({ error });

    const review = store.create({
      ...value,
      id: randomUUID(),
      dateTime: new Date().toISOString(),
    });
    broadcast({ type: 'created', review });
    res.status(201).json(review);
  });

  router.put('/:id', (req, res) => {
    const { value, error } = validateReviewInput(req.body);
    if (error) return res.status(400).json({ error });

    const review = store.update(req.params.id, value);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    broadcast({ type: 'updated', review });
    res.json(review);
  });

  router.delete('/:id', (req, res) => {
    const review = store.delete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    broadcast({ type: 'deleted', review });
    res.json(review);
  });

  app.use('/api/reviews', router);
  return app;
}

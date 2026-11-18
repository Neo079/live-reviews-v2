import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import { createReviewStore } from '../src/db.js';

describe('reviews API', () => {
  const events = [];
  let server;
  let base;

  before(async () => {
    const app = createApp({
      store: createReviewStore(':memory:'),
      broadcast: (event) => events.push(event),
    });
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    base = `http://localhost:${server.address().port}/api/reviews`;
  });

  after(() => server.close());

  const send = (path, method, body) =>
    fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body),
    });

  it('rejects invalid input', async () => {
    const res = await send('', 'POST', { title: '  ', content: 'x' });
    assert.equal(res.status, 400);
  });

  it('creates, updates, deletes and restores a review with events', async () => {
    const created = await (
      await send('', 'POST', { title: 'First', content: 'Hello' })
    ).json();
    assert.ok(created.id && created.dateTime);

    const updated = await (
      await send(`/${created.id}`, 'PUT', { title: 'Edited', content: 'Hello' })
    ).json();
    assert.equal(updated.title, 'Edited');
    assert.equal(updated.dateTime, created.dateTime);

    assert.equal((await send(`/${created.id}`, 'DELETE')).status, 200);
    assert.equal((await send(`/${created.id}`, 'GET')).status, 404);

    const restored = await send('/restore', 'POST', updated);
    assert.equal(restored.status, 201);
    assert.deepEqual(await restored.json(), updated);
    assert.equal((await send('/restore', 'POST', updated)).status, 409);

    assert.deepEqual(
      events.map((e) => e.type),
      ['created', 'updated', 'deleted', 'restored'],
    );
  });

  it('lists newest first', async () => {
    await send('', 'POST', { title: 'Newer', content: 'later' });
    const list = await (await send('', 'GET')).json();
    const times = list.map((r) => r.dateTime);
    assert.deepEqual(times, [...times].sort().reverse());
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  validateRestoreInput,
  validateReviewInput,
} from '../src/validation.js';

describe('validateReviewInput', () => {
  it('trims title and content', () => {
    const { value } = validateReviewInput({ title: ' Hi ', content: ' there ' });
    assert.deepEqual(value, { title: 'Hi', content: 'there' });
  });

  it('rejects missing, blank or non-string fields', () => {
    for (const body of [
      undefined,
      {},
      { title: '', content: 'x' },
      { title: 'x', content: '   ' },
      { title: 42, content: 'x' },
    ]) {
      assert.ok(validateReviewInput(body).error, JSON.stringify(body));
    }
  });

  it('rejects over-long fields', () => {
    assert.ok(
      validateReviewInput({ title: 'a'.repeat(201), content: 'x' }).error,
    );
    assert.ok(
      validateReviewInput({ title: 'x', content: 'a'.repeat(5001) }).error,
    );
  });
});

describe('validateRestoreInput', () => {
  const valid = {
    id: 'abc',
    title: 'Title',
    content: 'Content',
    dateTime: '2026-01-01T10:00:00.000Z',
  };

  it('accepts a full review and keeps its id and dateTime', () => {
    assert.deepEqual(validateRestoreInput(valid).value, valid);
  });

  it('requires an id and a valid dateTime', () => {
    assert.ok(validateRestoreInput({ ...valid, id: '' }).error);
    assert.ok(validateRestoreInput({ ...valid, dateTime: 'nope' }).error);
    assert.ok(validateRestoreInput({ ...valid, dateTime: undefined }).error);
  });

  it('still validates title and content', () => {
    assert.ok(validateRestoreInput({ ...valid, title: ' ' }).error);
  });
});

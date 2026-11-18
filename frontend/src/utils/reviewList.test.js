import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SORT,
  applyEvent,
  filterReviews,
  nextSort,
  sortReviews,
} from './reviewList.js';

const review = (id, title, dateTime, content = 'content') => ({
  id,
  title,
  content,
  dateTime,
});

const oldest = review('1', 'Banana', '2026-01-01T10:00:00.000Z');
const middle = review('2', 'apple', '2026-01-02T10:00:00.000Z');
const newest = review('3', 'Cherry', '2026-01-03T10:00:00.000Z');
const ids = (list) => list.map((item) => item.id);

describe('applyEvent', () => {
  it('adds a created review and keeps newest first', () => {
    const list = applyEvent([middle, oldest], {
      type: 'created',
      review: newest,
    });
    expect(ids(list)).toEqual(['3', '2', '1']);
  });

  it('places a restored review back at its original position', () => {
    const list = applyEvent([newest, oldest], {
      type: 'restored',
      review: middle,
    });
    expect(ids(list)).toEqual(['3', '2', '1']);
  });

  it('does not duplicate a review that already exists', () => {
    const list = applyEvent([newest, middle], {
      type: 'created',
      review: middle,
    });
    expect(ids(list)).toEqual(['3', '2']);
  });

  it('replaces an updated review in place', () => {
    const edited = { ...middle, title: 'Edited' };
    const list = applyEvent([newest, middle, oldest], {
      type: 'updated',
      review: edited,
    });
    expect(ids(list)).toEqual(['3', '2', '1']);
    expect(list[1].title).toBe('Edited');
  });

  it('removes a deleted review', () => {
    const list = applyEvent([newest, middle], {
      type: 'deleted',
      review: newest,
    });
    expect(ids(list)).toEqual(['2']);
  });

  it('ignores unknown events and does not mutate the input', () => {
    const original = [newest];
    expect(applyEvent(original, { type: 'other', review: oldest })).toBe(
      original,
    );
    applyEvent(original, { type: 'created', review: oldest });
    expect(original).toEqual([newest]);
  });
});

describe('filterReviews', () => {
  const reviews = [
    review('1', 'Great Phone', '2026-01-01T00:00:00.000Z', 'Battery lasts'),
    review('2', 'Laptop', '2026-01-02T00:00:00.000Z', 'Screen is GREAT'),
    review('3', 'Mouse', '2026-01-03T00:00:00.000Z', 'Okay'),
  ];

  it('returns everything for an empty or blank query', () => {
    expect(filterReviews(reviews, '')).toBe(reviews);
    expect(filterReviews(reviews, '   ')).toBe(reviews);
  });

  it('matches title or content, ignoring case', () => {
    expect(ids(filterReviews(reviews, 'great'))).toEqual(['1', '2']);
    expect(ids(filterReviews(reviews, 'BATTERY'))).toEqual(['1']);
  });

  it('trims the query', () => {
    expect(ids(filterReviews(reviews, '  mouse '))).toEqual(['3']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterReviews(reviews, 'zzz')).toEqual([]);
  });
});

describe('sortReviews', () => {
  const reviews = [oldest, middle, newest];

  it('sorts by date-time in both directions', () => {
    expect(ids(sortReviews(reviews, DEFAULT_SORT))).toEqual(['3', '2', '1']);
    expect(
      ids(sortReviews(reviews, { key: 'dateTime', direction: 'asc' })),
    ).toEqual(['1', '2', '3']);
  });

  it('sorts by title in both directions, ignoring case', () => {
    expect(
      ids(sortReviews(reviews, { key: 'title', direction: 'asc' })),
    ).toEqual(['2', '1', '3']);
    expect(
      ids(sortReviews(reviews, { key: 'title', direction: 'desc' })),
    ).toEqual(['3', '1', '2']);
  });

  it('breaks title ties with the newest review first', () => {
    const duplicate = review('4', 'APPLE', '2026-01-04T10:00:00.000Z');
    const sorted = sortReviews([middle, duplicate], {
      key: 'title',
      direction: 'asc',
    });
    expect(ids(sorted)).toEqual(['4', '2']);
  });

  it('does not mutate the input', () => {
    const input = [oldest, newest];
    sortReviews(input, { key: 'title', direction: 'desc' });
    expect(input).toEqual([oldest, newest]);
  });
});

describe('nextSort', () => {
  it('defaults to newest first', () => {
    expect(DEFAULT_SORT).toEqual({ key: 'dateTime', direction: 'desc' });
  });

  it('toggles the direction when the active column is clicked', () => {
    expect(nextSort(DEFAULT_SORT, 'dateTime')).toEqual({
      key: 'dateTime',
      direction: 'asc',
    });
    expect(nextSort({ key: 'title', direction: 'asc' }, 'title')).toEqual({
      key: 'title',
      direction: 'desc',
    });
  });

  it('starts a newly selected column in its natural direction', () => {
    expect(nextSort(DEFAULT_SORT, 'title')).toEqual({
      key: 'title',
      direction: 'asc',
    });
    expect(nextSort({ key: 'title', direction: 'desc' }, 'dateTime')).toEqual({
      key: 'dateTime',
      direction: 'desc',
    });
  });
});

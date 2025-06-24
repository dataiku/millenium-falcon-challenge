import { expect, it, describe } from 'vitest';
import { MinPriorityQueue } from './MinPriorityQueue';

const compareNums = (a: number, b: number) => a - b;

describe('MinPriorityQueue', () => {
  it.each([
    // sorted items
    [
      [1, 2, 3],
      [1, 2, 3],
    ],
    // unsorted items
    [
      [3, 1, 2],
      [1, 2, 3],
    ],
    // unsorted items and duplicates
    [
      [3, 1, 4, 1, 5],
      [1, 1, 3, 4, 5],
    ],
  ] as const)(
    'should push and pop elements in correct order (numbers)',
    (arrIn, arrOut) => {
      const mpq = new MinPriorityQueue(compareNums);
      arrIn.forEach(mpq.push);
      const arrPopped = [];
      while (!mpq.isEmpty()) {
        arrPopped.push(mpq.pop()!);
      }
      expect(mpq.pop()).toBeUndefined();
      expect(arrPopped).toEqual(arrOut);
    },
  );

  it('should push and pop elements in correct order (tuples/arrays)', () => {
    // Default comparator for arrays compares lexicographically
    const pq = new MinPriorityQueue<[number, number, string, number]>(
      (a, b) => a[0] - b[0] || a[1] - b[1],
    );
    pq.push([1, 5, 'A', 10]);
    pq.push([0, 10, 'B', 5]);
    pq.push([1, 2, 'C', 8]);
    pq.push([0, 5, 'D', 12]);

    // Expected order:
    // [0, 5, "D", 12] (min encounters, then min day)
    // [0, 10, "B", 5] (min encounters, then min day)
    // [1, 2, "C", 8] (min encounters, then min day)
    // [1, 5, "A", 10] (min encounters, then min day)

    expect(pq.pop()).toEqual([0, 5, 'D', 12]);
    expect(pq.pop()).toEqual([0, 10, 'B', 5]);
    expect(pq.pop()).toEqual([1, 2, 'C', 8]);
    expect(pq.pop()).toEqual([1, 5, 'A', 10]);
    expect(pq.isEmpty()).toBe(true);
  });

  it('should return undefined when popping from an empty queue', () => {
    const pq = new MinPriorityQueue(compareNums);
    expect(pq.pop()).toBeUndefined();
  });

  it('size should reflect number of elements', () => {
    const pq = new MinPriorityQueue(compareNums);
    expect(pq.size()).toBe(0);
    pq.push(1);
    expect(pq.size()).toBe(1);
    pq.push(2);
    expect(pq.size()).toBe(2);
    pq.pop();
    expect(pq.size()).toBe(1);
    pq.pop();
    expect(pq.size()).toBe(0);
  });

  it('isEmpty should be true when empty and false otherwise', () => {
    const pq = new MinPriorityQueue(compareNums);
    expect(pq.isEmpty()).toBe(true);
    pq.push(1);
    expect(pq.isEmpty()).toBe(false);
    pq.pop();
    expect(pq.isEmpty()).toBe(true);
  });
});

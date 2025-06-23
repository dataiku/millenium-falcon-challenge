const getLeftChildIndex = (index: number) => 2 * index + 1;
const getRightChildIndex = (index: number) => 2 * index + 2;
const getParentIndex = (index: number) => Math.floor((index - 1) / 2);

/**
 * A generic Min-Priority Queue implementation using a binary heap
 * The `compare` function determines the priority
 */
export class MinPriorityQueue<T> {
  private heap: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {}

  size = () => this.heap.length;
  isEmpty = () => this.size() === 0;
  peek = () => (this.isEmpty() ? undefined : this.heap[0]);

  /**
   * Pushes an item onto the heap, maintaining the heap property.
   * @param item The item to add.
   */
  push(item: T) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
    return this;
  }

  /**
   * Removes and returns the smallest item from the heap.
   * @returns The smallest item, or undefined if the heap is empty.
   */
  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    const min = this.peek();
    const last = this.heap.pop();
    if (!this.isEmpty() && last !== undefined) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = getParentIndex(index);
      // Heap property is satisfied
      if (this.compareByIndices(index, parentIndex) >= 0) {
        break;
      }
      // If the current item is smaller than its parent, swap them
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const lastIndex = this.heap.length - 1;
    while (true) {
      // Assume current node is the smallest
      let smallestChildIndex = index;

      // Check if left child exists and is smaller
      let leftChildIndex = getLeftChildIndex(index);
      if (
        leftChildIndex <= lastIndex &&
        this.compareByIndices(leftChildIndex, smallestChildIndex) < 0
      ) {
        smallestChildIndex = leftChildIndex;
      }

      // Check if right child exists and is smaller than the current smallest
      let rightChildIndex = getRightChildIndex(index);
      if (
        rightChildIndex <= lastIndex &&
        this.compareByIndices(rightChildIndex, smallestChildIndex) < 0
      ) {
        smallestChildIndex = rightChildIndex;
      }

      // If the smallest child is not the current node, swap and continue bubbling down
      if (smallestChildIndex === index) {
        // Heap property is satisfied
        break;
      }
      this.swap(index, smallestChildIndex);
      index = smallestChildIndex;
    }
  }

  private compareByIndices = (i: number, j: number) =>
    this.compare(this.heap[i], this.heap[j]);
  private swap(i: number, j: number) {
    swapItems(this.heap, i, j);
  }
}

const swapItems = <T>(arr: T[], i: number, j: number) => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
};

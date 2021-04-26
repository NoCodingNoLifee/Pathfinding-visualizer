import { IPriorityQueue } from './interfaces/IPriorityQueue';

interface PriorityItem<T> {
  Priority: number;
  Item: T;
}

export class PriorityQueue<T> implements IPriorityQueue<T> {
  private data: Array<PriorityItem<T>> = new Array();

  insert(item: T, priority: number): void {
    this.data.push({ Priority: priority, Item: item });

    this.data.sort((a, b) => b.Priority - a.Priority);
  }

  peek(): T {
    return this.data.length == 0 ? null : this.data[0].Item;
  }

  pop(): T {
    return this.data.length == 0 ? null : this.data.pop().Item;
  }

  size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length == 0;
  }
}

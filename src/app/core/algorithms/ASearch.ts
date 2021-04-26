import { Node } from 'src/app/core/models/Node';
import { SearchResult } from 'src/app/core/models/SearchResult';
import { ISearchAlgorithm } from '../interfaces/ISearchAlgorithm';
import { NodeHelper } from '../helpers/NodeHelper';

import { PriorityQueue } from '../PriorityQueue';

export class ASearch implements ISearchAlgorithm {
  private path: Array<Node>;
  private cost: Array<number>;
  private visitedNodes: Array<Node>;

  Name: string = 'A* Search';

  constructor(private graph: Array<Node>) {}

  private Init(graph: Array<Node>): void {
    this.path = new Array(graph.length);
    this.cost = new Array<number>(graph.length).fill(Number.MAX_SAFE_INTEGER);
    this.visitedNodes = new Array();
  }

  Find(from: Node, to: Node): SearchResult {
    this.Init(this.graph);
    this.cost[from.Id] = 0;

    var queue = new PriorityQueue<Node>();
    queue.insert(from, 0);

    var result = this.A(queue, to);

    var pathToGoal = new Array<Node>();
    if (result == true) {
      pathToGoal = NodeHelper.GetPath(this.path, from, to);
    }

    return {
      Path: pathToGoal,
      Succeed: result,
      VisitedNodes: this.visitedNodes,
    } as SearchResult;
  }

  A(queue: PriorityQueue<Node>, to: Node): boolean {
    if (queue.isEmpty()) return false;

    let current = queue.pop() as Node;
    current.IsVisited = true;

    this.visitedNodes.push(current);

    if (current.Id == to.Id) return true;

    current.Neighbors.forEach((node) => {
      if (node.IsWall) return;

      let cost = this.cost[current.Id] + node.Weight;

      if (cost < this.cost[node.Id]) {
        this.cost[node.Id] = cost;
        var priority = this.Heuristic(node, to) + cost;

        queue.insert(node, priority);
        this.path[node.Id] = current;
      }
    });

    return this.A(queue, to);
  }

  Heuristic(from: Node, to: Node): number {
    return (
      Math.abs(from.Position.X - to.Position.X) +
      Math.abs(from.Position.Y - to.Position.Y)
    );
  }
}

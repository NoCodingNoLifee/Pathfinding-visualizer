import { Node } from 'src/app/core/models/Node';
import { SearchResult } from 'src/app/core/models/SearchResult';
import { ISearchAlgorithm } from '../interfaces/ISearchAlgorithm';
import { NodeHelper } from '../helpers/NodeHelper';

import { PriorityQueue } from '../PriorityQueue';

export class GreedyBestFirstSearch implements ISearchAlgorithm {
  Name: string = 'Greedy BestFirst Search';

  private path: Array<Node>;
  private visitedNodes: Array<Node>;

  constructor(private graph: Array<Node>) {}

  private Init(graph: Array<Node>): void {
    this.path = new Array(graph.length);
    this.visitedNodes = new Array();
  }

  Find(from: Node, to: Node): SearchResult {
    this.Init(this.graph);

    var queue = new PriorityQueue<Node>();
    queue.insert(from, 0);

    var result = this.Greedy(queue, to);

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

  Greedy(queue: PriorityQueue<Node>, to: Node): boolean {
    if (queue.isEmpty()) return false;

    let current = queue.pop() as Node;
    current.IsVisited = true;

    this.visitedNodes.push(current);

    if (current.Id == to.Id) return true;

    current.Neighbors.forEach((node) => {
      if (node.IsWall) return;

      if (!this.path.includes(node)) {
        var priority = this.Heuristic(node, to);

        queue.insert(node, priority);
        this.path[node.Id] = current;
      }
    });

    return this.Greedy(queue, to);
  }

  Heuristic(from: Node, to: Node): number {
    return (
      Math.abs(from.Position.X - to.Position.X) +
      Math.abs(from.Position.Y - to.Position.Y) +
      from.Weight
    );
  }
}

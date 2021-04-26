import { Node } from 'src/app/core/models/Node';
import { SearchResult } from 'src/app/core/models/SearchResult';
import { ISearchAlgorithm } from '../interfaces/ISearchAlgorithm';
import { NodeHelper } from '../helpers/NodeHelper';

export class DijkstrasSearch implements ISearchAlgorithm {
  private path: Array<Node>;
  private cost: Array<number>;
  private visitedNodes: Array<Node>;

  Name: string = 'Dijkstras Search';

  constructor(graph: Array<Node>) {
    this.path = new Array(graph.length);
    this.cost = new Array<number>(graph.length).fill(Number.MAX_SAFE_INTEGER);
    this.visitedNodes = new Array();
  }

  Find(from: Node, to: Node): SearchResult {
    this.cost[from.Id] = 0;

    var result = this.Dijkstras(new Array(from), to);

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

  Dijkstras(buffer: Array<Node>, to: Node): boolean {
    if (buffer.length == 0) return false;

    let current = buffer.shift() as Node;
    current.IsVisited = true;

    this.visitedNodes.push(current);

    if (current.Id == to.Id) return true;

    current.Neighbors.forEach((node) => {
      if (node.IsWall) return;

      let cost = this.cost[current.Id] + node.Weight;

      if (cost < this.cost[node.Id]) {
        this.cost[node.Id] = cost;

        buffer.push(node);
        this.path[node.Id] = current;
      }
    });

    return this.Dijkstras(buffer, to);
  }
}

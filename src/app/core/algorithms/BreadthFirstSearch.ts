import { Node } from 'src/app/models/Node';
import { SearchResult } from 'src/app/models/SearchResult';
import { ISearchAlgorithm } from '../interfaces/ISearchAlgorithm';
import { NodeHelper } from '../helpers/NodeHelper';

export class BreadthFirstSearch implements ISearchAlgorithm {
  private path: Array<Node>;
  private visitedNodes: Array<Node>;

  constructor(graph: Array<Node>) {
    this.path = new Array<Node>(graph.length);
    this.visitedNodes = new Array();
  }

  public Find(from: Node, to: Node): SearchResult {
    var result = this.BFS(new Array(from), to);

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

  private BFS(buffer: Array<Node>, to: Node): boolean {
    if (buffer.length == 0) return false;

    let current = buffer.shift() as Node;
    current.IsVisited = true;

    this.visitedNodes.push(current);

    if (current.Id == to.Id) return true;

    current.Neighbors.forEach((node) => {
      if (node.IsVisited || node.IsWall || buffer.includes(node)) return;

      buffer.push(node);
      this.path[node.Id] = current;
    });

    return this.BFS(buffer, to);
  }
}

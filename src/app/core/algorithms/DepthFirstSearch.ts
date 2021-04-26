import { Node } from 'src/app/core/models/Node';
import { SearchResult } from 'src/app/core/models/SearchResult';
import { ISearchAlgorithm } from '../interfaces/ISearchAlgorithm';

export class DepthFirstSearch implements ISearchAlgorithm {
  Name: string = 'Depth First Search';

  private visitedNodes: Array<Node>;
  private path: Array<Node>;

  Find(from: Node, to: Node): SearchResult {
    this.visitedNodes = new Array<Node>();
    this.path = new Array<Node>();

    var result = this.DFS(from, to);

    if (result === true) {
      this.path.unshift(from);
    }

    return {
      Path: this.path,
      Succeed: result,
      VisitedNodes: this.visitedNodes,
    } as SearchResult;
  }

  DFS(from: Node, to: Node): boolean {
    if (from.Id == to.Id) return true;

    this.visitedNodes.push(from);

    var neigbors = from.Neighbors.filter(
      (node) => !this.visitedNodes.includes(node) && !node.IsWall
    );

    for (let i = 0; i < neigbors.length; i++) {
      if (this.DFS(neigbors[i], to)) {
        this.path.unshift(neigbors[i]);
        return true;
      }
    }

    return false;
  }
}

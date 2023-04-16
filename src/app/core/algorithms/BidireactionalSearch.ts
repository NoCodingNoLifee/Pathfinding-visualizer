import { Node } from 'src/app/core/models/Node';
import { SearchResult } from 'src/app/core/models/SearchResult';
import { ISearchAlgorithm } from '../interfaces/ISearchAlgorithm';
import { NodeHelper } from '../helpers/NodeHelper';

export class BidireactionalSearch implements ISearchAlgorithm {
  Name: string = 'Bidirectional Search';

  private path: Array<Node>;
  private visitedNodes: Array<Node>;
  private s_visited: boolean[];
  private t_visited: boolean[];

  constructor(graph: Array<Node>) {
    this.path = new Array<Node>(graph.length);
    this.visitedNodes = new Array();

    this.s_visited = new Array<boolean>(graph.length);
    this.t_visited = new Array<boolean>(graph.length);
  }

  Find(from: Node, to: Node): SearchResult {
    var result = this.BiDir(from, to);

    // var pathToGoal = new Array<Node>();
    // if (result == true) {
    //   pathToGoal = NodeHelper.GetPath(this.path, from, to);
    // }

    return {
      Path: null,
      Succeed: result,
      VisitedNodes: this.visitedNodes,
    } as SearchResult;
  }

  BiDir(from: Node, to: Node): boolean {
    let s_queue: Node[], t_queue: Node[];
    s_queue = new Array<Node>();
    t_queue = new Array<Node>();

    //let intersectNode: Node;

    s_queue.push(from);
    t_queue.push(to);

    while (s_queue.length != 0 && t_queue.length != 0) {
      this.BFS(s_queue, this.s_visited);
      this.BFS(t_queue, this.t_visited);

      if (this.IsIntersecting(this.s_visited, this.t_visited)) {
        return true;
      }
    }

    return false;
  }

  BFS(buffer: Array<Node>, visited: boolean[]): void {
    let current = buffer.shift() as Node;
    current.IsVisited = true;
    this.visitedNodes.push(current);

    current.Neighbors.forEach((node) => {
      if (node.IsVisited || node.IsWall || buffer.includes(node)) return;

      buffer.push(node);
      this.path[node.Id] = current;
      visited[node.Id] = true;

      //this.visitedNodes.push(current);
    });
  }

  IsIntersecting(s_visited: boolean[], t_visited: boolean[]): boolean {
    for (let i = 0; i < s_visited.length; i++) {
      if (s_visited[i] && t_visited[i]) return true;
    }

    return false;
  }
}

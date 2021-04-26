import { Node } from '../models/Node';

export class NodeHelper {
  static GetPath(cameFrom: Array<Node>, from: Node, to: Node): Array<Node> {
    let path = new Array<Node>();
    let current = to;

    while (current.Id != from.Id) {
      path.push(current);
      current = cameFrom[current.Id];
    }

    path.push(from);

    return path.reverse();
  }
}

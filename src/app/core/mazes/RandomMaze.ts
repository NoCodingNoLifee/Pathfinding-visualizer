import { GraphService } from '../GraphService';
import { IMazeGenerator } from '../interfaces/IMazeGenerator';
import { Node } from '../models/Node';

export class RandomMaze implements IMazeGenerator {
  Name: string = 'Basic Random Maze';

  constructor(private graphService: GraphService) {}

  Generate(startNode: Node, goalNode: Node): Node[] {
    let walls = new Array<Node>();
    this.graphService.Graph.forEach((node) => {
      if (
        Math.random() <= 0.33 &&
        node.Id != startNode.Id &&
        node.Id != goalNode.Id
      ) {
        walls.push(node);
      }
    });

    return walls;
  }
}

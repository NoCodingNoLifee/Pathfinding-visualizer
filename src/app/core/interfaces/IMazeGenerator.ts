import { Node } from '../models/Node';

export interface IMazeGenerator {
  Name: string;
  Generate(startNode: Node, goalNode: Node): Array<Node>;
}

import { Point } from './Point';

export interface Node {
  Id: number;
  IsVisited: boolean;
  IsWall: boolean;
  Weight: number;
  Neighbors: Array<Node>;
  Position: Point;
  IsStart: boolean;
  IsGoal: boolean;
}

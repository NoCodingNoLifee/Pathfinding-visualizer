import { GraphService } from '../GraphService';
import { IMazeGenerator } from '../interfaces/IMazeGenerator';
import { Node } from '../models/Node';

export class RecursiveDivision implements IMazeGenerator {
  Name: string = 'Recursive Division';

  private walls: Node[];
  constructor(private graphService: GraphService) {}

  Generate(startNode: Node, goalNode: Node): Node[] {
    this.walls = new Array<Node>();

    let vertical = this.Range(this.graphService.Rows);
    let horizontal = this.Range(this.graphService.Cols);

    this.GetRecursiveWalls(vertical, horizontal, startNode, goalNode);

    return this.walls;
  }

  GetRecursiveWalls(
    vertical: number[],
    horizontal: number[],
    startNode: Node,
    goalNode: Node
  ): void {
    if (vertical.length < 2 || horizontal.length < 2) return;

    let randNum: number, nodes: Node[];

    if (vertical.length > horizontal.length) {
      randNum = this.GenerateRandomItem(vertical, true);

      nodes = this.graphService.Graph.filter(
        (node) =>
          node.Position.X == randNum && horizontal.includes(node.Position.Y)
      );

      this.GetRecursiveWalls(
        vertical.slice(0, vertical.indexOf(randNum)),
        horizontal,
        startNode,
        goalNode
      );

      this.GetRecursiveWalls(
        vertical.slice(vertical.indexOf(randNum) + 1),
        horizontal,
        startNode,
        goalNode
      );
    } else {
      randNum = this.GenerateRandomItem(horizontal, true);

      nodes = this.graphService.Graph.filter(
        (node) =>
          node.Position.Y == randNum && vertical.includes(node.Position.X)
      );

      this.GetRecursiveWalls(
        vertical,
        horizontal.slice(0, horizontal.indexOf(randNum)),
        startNode,
        goalNode
      );

      this.GetRecursiveWalls(
        vertical,
        horizontal.slice(horizontal.indexOf(randNum) + 1),
        startNode,
        goalNode
      );
    }

    this.AddWall(nodes);
  }

  private AddWall(nodes: Node[]): void {
    if (nodes.length === 2) return;

    let entry = nodes.filter((node) => node.IsStart || node.IsGoal);

    if (entry[0] === undefined) {
      entry.push(this.GenerateRandomItem(nodes, false));
    }

    for (let wall of nodes.filter((node) => !entry.includes(node))) {
      this.walls.push(wall);
    }
  }

  private GenerateRandomItem<T>(array: T[], flag: boolean) {
    let max = array.length - 1;
    let randomNum =
      Math.floor(Math.random() * (max / 2)) +
      Math.floor(Math.random() * (max / 2));
    if ((flag && randomNum % 2 === 0) || (!flag && randomNum % 2 !== 0)) {
      if (randomNum === max) {
        randomNum -= 1;
      } else {
        randomNum += 1;
      }
    }
    return array[randomNum];
  }

  private Range(len: number): Array<number> {
    let arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(i);
    }
    return arr;
  }
}

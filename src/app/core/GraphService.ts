import { Injectable } from '@angular/core';
import { Node, Point } from './models';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  Graph: Array<Node> = new Array();
  Grid: Array<Node[]> = new Array();

  Rows: number = 20;
  Cols: number = 50;

  constructor() {}

  public Initialize(rows: number, cols: number): void {
    this.Rows = rows;
    this.Cols = cols;

    this.Graph = new Array<Node>(rows * cols);

    for (let i = 0; i < rows * cols; i++) {
      this.Graph[i] = { Id: i, Weight: 1 } as Node;
      this.Graph[i].Neighbors = new Array();
    }

    let counter = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let from = this.Graph[counter];
        from.Position = { Latitude: i, Longitude: j };

        let to: Node;
        if (j != cols - 1) {
          to = this.Graph[counter + 1];
          from.Neighbors.push(to);
          to.Neighbors.push(from);
        }

        if (i != rows - 1) {
          to = this.Graph[counter + cols];
          from.Neighbors.push(to);
          to.Neighbors.push(from);
        }

        counter++;
      }
    }

    this.InitializeGrid();
  }

  private InitializeGrid(): void {
    for (let i = 0; i < this.Rows; i++) {
      this.Grid[i] = this.Graph.slice(i * this.Cols, i * this.Cols + this.Cols);
    }
  }

  public Clear(removeWall: boolean = true): void {
    this.Graph.forEach((node) => {
      node.IsVisited = false;
      if (removeWall) node.IsWall = false;
    });
  }

  public GetNode(position: Point): Node {
    let node = this.Graph.filter(
      (n) =>
        n.Position.Latitude == position.Latitude &&
        n.Position.Longitude == position.Longitude
    );

    return node[0];
  }

  public GetNodeById(id: number): Node {
    let node = this.Graph.filter((n) => n.Id == id)[0];

    return node;
  }

  public GetNearesNode(position: Point): Node {
    let nearesNode: Node = this.Graph[0];

    this.Graph.forEach((node) => {
      if (
        this.Heuristic(node.Position, position) <
        this.Heuristic(nearesNode.Position, position)
      ) {
        nearesNode = node;
      }
    });

    return nearesNode;
  }

  private Heuristic(from: Point, to: Point): number {
    return (
      Math.abs(from.Latitude - to.Latitude) +
      Math.abs(from.Longitude - to.Longitude)
    );
  }
}

import { Injectable } from '@angular/core';
import { Node } from './models/Node';
import { Point } from './models/Point';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  Graph: Array<Node> = new Array();
  Grid: Array<Node[]> = new Array();

  Rows: number = 20;
  Cols: number = 50;
  constructor() {
    this.Initialize(this.Rows, this.Cols);
  }

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
        from.Position = { X: i, Y: j };

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
      (n) => n.Position.X == position.X && n.Position.Y == position.Y
    );

    return node[0];
  }
}

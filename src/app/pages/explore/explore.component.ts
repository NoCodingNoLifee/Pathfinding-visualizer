import { Component, OnInit } from '@angular/core';

import { GraphService } from '../../core/GraphService';
import { Node } from '../../models/Node';

import { ISearchAlgorithm } from '../../core/interfaces/ISearchAlgorithm';
import { BreadthFirstSearch } from '../../core/algorithms/BreadthFirstSearch';
import { SearchResult } from 'src/app/models/SearchResult';

@Component({
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  GraphService: GraphService;
  StartNode: Node;
  GoalNode: Node;
  SearchAlgorithm: ISearchAlgorithm;

  private isMousePressed: boolean = false;

  constructor(private _graphService: GraphService) {
    this.GraphService = _graphService;
    this.StartNode = this.GraphService.GetNode({ X: 10, Y: 30 });
    this.GoalNode = this.GraphService.GetNode({ X: 10, Y: 35 });

    this.StartNode.IsStart = true;
    this.GoalNode.IsGoal = true;

    this.SearchAlgorithm = new BreadthFirstSearch(_graphService.Graph);
  }

  ngOnInit(): void {
    this.GraphService = this._graphService;

    window.addEventListener('mouseup', (e) => {
      this.isMousePressed = false;
    });
  }

  onMouseDownNode(row: number, col: number): void {
    let node = this._graphService.GetNode({ X: row, Y: col });

    if (!node.IsStart && !node.IsGoal) node.IsWall = !node.IsWall;

    this.isMousePressed = true;
  }

  onMouseEnterNode(row: number, col: number): void {
    if (this.isMousePressed) {
      let node = this._graphService.GetNode({ X: row, Y: col });

      if (!node.IsStart && !node.IsGoal) node.IsWall = !node.IsWall;
    }
  }

  run(): void {
    let result = this.SearchAlgorithm.Find(this.StartNode, this.GoalNode);

    console.log(result);
    this.animate(result);
  }

  animate(searchResult: SearchResult): void {
    this.animateVisitedPath(searchResult.VisitedNodes);
    this.animateShortestPath(searchResult.Path);
  }

  animateVisitedPath(visitedNodes: Array<Node>): void {
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        let node = visitedNodes[i];
        let td = <HTMLElement>(
          document.getElementById(`node-${node.Position.X}-${node.Position.Y}`)
        );
        td.className = 'node visited';
      }, 1);
    }
  }

  animateShortestPath(pathToGoal: Array<Node>): void {
    for (let i = 0; i < pathToGoal.length; i++) {
      setTimeout(() => {
        const node = pathToGoal[i];
        let td = <HTMLElement>(
          document.getElementById(`node-${node.Position.X}-${node.Position.Y}`)
        );

        td.className = 'node shortest-path';
      }, 50 * i);
    }
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

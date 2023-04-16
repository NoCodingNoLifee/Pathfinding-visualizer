import { Component, OnInit } from '@angular/core';

import { GraphService } from '../../core/GraphService';
import { Node, SearchResult } from '../../core/models';

import { ISearchAlgorithm } from '../../core/interfaces/ISearchAlgorithm';

import * as Alg from '../../core/algorithms';

import { IMazeGenerator } from '../../core/interfaces/IMazeGenerator';
import { RecursiveDivision } from '../../core/mazes/RecursiveDivision';
import { RandomMaze } from '../../core/mazes/RandomMaze';

@Component({
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  GraphService: GraphService;
  StartNode: Node;
  GoalNode: Node;
  SearchAlgorithms: Array<ISearchAlgorithm>;
  AnimationSpeed: number = 200;
  SelectedAlgorithm: ISearchAlgorithm;
  MazeAlgorithms: Array<IMazeGenerator>;

  private isMousePressed: boolean = false;
  private rotateMainPos: string;

  constructor(private _graphService: GraphService) {
    _graphService.Initialize(_graphService.Rows, _graphService.Cols);
    this.GraphService = _graphService;
    this.StartNode = this.GraphService.GetNode({ Latitude: 10, Longitude: 25 });
    this.GoalNode = this.GraphService.GetNode({ Latitude: 10, Longitude: 35 });

    this.StartNode.IsStart = true;
    this.GoalNode.IsGoal = true;

    this.SearchAlgorithms = [
      new Alg.DijkstrasSearch(_graphService.Graph),
      new Alg.BreadthFirstSearch(_graphService.Graph),
      new Alg.AStarSearch(_graphService.Graph),
      new Alg.DepthFirstSearch(),
      new Alg.GreedyBestFirstSearch(_graphService.Graph),
      new Alg.BidireactionalSearch(_graphService.Graph),
    ];

    this.MazeAlgorithms = [
      new RecursiveDivision(_graphService),
      new RandomMaze(_graphService),
    ];
  }

  ngOnInit(): void {
    this.GraphService = this._graphService;

    window.addEventListener('mouseup', (e) => {
      this.isMousePressed = false;
      this.rotateMainPos = null;
    });
  }

  changeAlgoritm(algorithm: ISearchAlgorithm): void {
    console.log(algorithm);
    this.SelectedAlgorithm = algorithm;
  }

  async buildMaze(mazeGenerator: IMazeGenerator): Promise<void> {
    this.clearGrid(true);

    let walls = mazeGenerator.Generate(this.StartNode, this.GoalNode);
    console.log(walls);

    await this.animateWalls(walls);
    // walls.forEach(async (node) => {
    //   node.IsWall = true;
    //   await this.delay(this.AnimationSpeed);
    // });
  }

  async animateWalls(walls: Array<Node>): Promise<void> {
    return new Promise(async () => {
      for (let i = 0; i < walls.length; i++) {
        walls[i].IsWall = true;
        await this.delay(20);
      }
    });
  }

  onMouseDownNode(row: number, col: number): void {
    let node = this._graphService.GetNode({ Latitude: row, Longitude: col });

    if (!node.IsStart && !node.IsGoal) node.IsWall = !node.IsWall;
    else this.rotateMainPos = node.IsStart ? 'start' : 'goal';

    this.isMousePressed = true;
  }

  onMouseEnterNode(row: number, col: number): void {
    if (this.isMousePressed) {
      let node = this._graphService.GetNode({ Latitude: row, Longitude: col });

      if (this.rotateMainPos == 'start') {
        this.StartNode.IsStart = false;
        this.StartNode = node;
        node.IsStart = true;
      } else if (this.rotateMainPos == 'goal') {
        this.GoalNode.IsGoal = false;
        this.GoalNode = node;
        node.IsGoal = true;
      }

      if (!node.IsStart && !node.IsGoal) node.IsWall = !node.IsWall;
    }
  }

  clearGrid(removeWall: boolean): void {
    this._graphService.Clear(removeWall);
    this.clearPath();
  }

  clearPath(): void {
    let nodes = Array.from(
      document.querySelectorAll('.visited,.shortest-path')
    );

    nodes.forEach((node) => {
      node.className = node.className
        .replace(new RegExp(' visited', 'g'), '')
        .replace('shortest-path', '');
    });
  }

  async run(): Promise<void> {
    this.clearGrid(false);

    if (this.SearchAlgorithms == null) {
      // some massage
      return;
    }

    let result = this.SelectedAlgorithm.Find(this.StartNode, this.GoalNode);

    console.log(result);
    await this.animate(result);
  }

  async animate(searchResult: SearchResult): Promise<void> {
    await this.animatePath(searchResult.VisitedNodes, 'visited');
    await this.animatePath(searchResult.Path, 'shortest-path');
  }

  async animatePath(path: Array<Node>, classNames: string): Promise<void> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < path.length; i++) {
        let node = path[i];
        let td = document.getElementById(
          `node-${node.Position.Latitude}-${node.Position.Longitude}`
        ) as HTMLElement;

        td.className += ' ' + classNames;

        await this.delay(this.AnimationSpeed);
      }
      await resolve();
    });
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

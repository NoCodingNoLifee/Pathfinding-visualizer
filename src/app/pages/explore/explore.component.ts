import { Component, OnInit } from '@angular/core';

import { GraphService } from '../../core/GraphService';
import { Node } from '../../core/models/Node';
import { SearchResult } from 'src/app/core/models/SearchResult';

import { ISearchAlgorithm } from '../../core/interfaces/ISearchAlgorithm';
import { BreadthFirstSearch } from '../../core/algorithms/BreadthFirstSearch';
import { DijkstrasSearch } from '../../core/algorithms/DijkstrasSearch';
import { ASearch } from '../../core/algorithms/ASearch';
import { DepthFirstSearch } from '../../core/algorithms/DepthFirstSearch';
import { GreedyBestFirstSearch } from '../../core/algorithms/GreedyBestFirstSearch';

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
    this.GraphService = _graphService;
    this.StartNode = this.GraphService.GetNode({ X: 10, Y: 25 });
    this.GoalNode = this.GraphService.GetNode({ X: 10, Y: 35 });

    this.StartNode.IsStart = true;
    this.GoalNode.IsGoal = true;

    this.SearchAlgorithms = [
      new DijkstrasSearch(_graphService.Graph),
      new BreadthFirstSearch(_graphService.Graph),
      new ASearch(_graphService.Graph),
      new DepthFirstSearch(),
      new GreedyBestFirstSearch(_graphService.Graph),
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

  buildMaze(mazeGenerator: IMazeGenerator): void {
    this.clearGrid(true);

    let walls = mazeGenerator.Generate(this.StartNode, this.GoalNode);

    console.log(walls);

    walls.forEach((node) => {
      if (node != undefined) node.IsWall = true;
    });
  }

  onMouseDownNode(row: number, col: number): void {
    let node = this._graphService.GetNode({ X: row, Y: col });

    if (!node.IsStart && !node.IsGoal) node.IsWall = !node.IsWall;
    else this.rotateMainPos = node.IsStart ? 'start' : 'goal';

    this.isMousePressed = true;
  }

  onMouseEnterNode(row: number, col: number): void {
    if (this.isMousePressed) {
      let node = this._graphService.GetNode({ X: row, Y: col });

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
          `node-${node.Position.X}-${node.Position.Y}`
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

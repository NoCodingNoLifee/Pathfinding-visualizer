import { Component, OnInit } from '@angular/core';

//import { OsmParser } from '../../core/OsmParser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  parse(): void {
    //const parser = new OsmParser();
    //parser.Parse('');
  }
}

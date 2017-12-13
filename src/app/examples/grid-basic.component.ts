import { Component, OnInit } from '@angular/core';
import { Column, GridOption } from 'angular-slickgrid';

// using external js modules in Angular
declare var Slick: any;

@Component({
  templateUrl: './grid-basic.component.html'
})
export class GridBasicComponent implements OnInit {
  title = 'Example 1: Basic Grid';
  subTitle = `
    Basic Grid with fixed sizes (800 x 400) set by "gridHeight" &amp; "gridWidth"
    <ul>
      <li><a href="https://github.com/ghiscoding/angular-slickgrid/wiki/HOWTO---Step-by-Step" target="_blank">Wiki HOWTO link</a></li>
    </ul>
  `;

  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  ngOnInit(): void {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true },
      { id: 'start', name: 'Start', field: 'start' },
      { id: 'finish', name: 'Finish', field: 'finish' },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true }
    ];
    this.gridOptions = {
      enableAutoResize: false
    };

    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      this.dataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        start: `${randomMonth}/${randomDay}/${randomYear}`,
        finish: `${randomMonth}/${randomDay}/${randomYear}`,
        effortDriven: (i % 5 === 0)
      };
    }
  }
}

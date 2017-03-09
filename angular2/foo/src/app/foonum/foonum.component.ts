import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-foonum',
  templateUrl: './foonum.component.html',
  styleUrls: ['./foonum.component.css']
})
export class FoonumComponent implements OnInit {
  foo = 0;
  constructor() { }

  ngOnInit() {
      this.foo = _.random(5,89);
  }

}

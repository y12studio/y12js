import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'App works !';
  foo = _.random(10000);

  ngOnInit() {
    console.log('hello `Home` component');
    console.log(_.uniq(['A', 'B', 'A']));
  }
}

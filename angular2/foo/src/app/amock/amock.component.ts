import { Component, OnInit } from '@angular/core';
import { mockServer, MockList } from 'graphql-tools';
import * as _ from 'lodash';

const schema = `
  type User {
    id: ID!
    name: String
    lists: [List]
  }
  type List {
    id: ID!
    name: String
    owner: User
    incomplete_count: Int
    tasks(completed: Boolean): [Task]
  }
  type Task {
    id: ID!
    text: String
    completed: Boolean
    list: List
  }
  type RootQuery {
    user(id: ID): User
  }
  schema {
    query: RootQuery
  }
`;

// Mock functions are defined per type and return an
// object with some or all of the fields of that type.
// If a field on the object is a function, that function
// will be used to resolve the field if the query requests it.
const server = mockServer(schema, {
  RootQuery: () => ({
    user: (o, { id }) => ({ id }),
  }),
  List: () => ({
    name: () => `Hoho ${_.random(1, 100)}`,
    tasks: () => new MockList(4, (o, { completed }) => ({ completed })),
  }),
  Task: () => ({ text: `Task x ${_.random(200, 300)}` }),
  User: () => ({ name: `HahaName ${_.random(1, 20)}` }),
});

const ql = `
query tasksForUser{
user(id: 6) {
id
name
lists {
  name
  completeTasks: tasks(completed: true) {
    completed
    text
  }
  incompleteTasks: tasks(completed: false) {
    completed
    text
  }
  anyTasks: tasks {
    completed
    text
  }
}
}
}`


@Component({
  selector: 'app-amock',
  templateUrl: './amock.component.html',
  styleUrls: ['./amock.component.css']
})
export class AmockComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      server.query(ql).then(r=>console.log(JSON.stringify(r)));
  }

}

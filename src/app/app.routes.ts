import { Routes } from '@angular/router';
import {Todo} from './features/todo/todo';

export const routes: Routes = [
  {path: '', redirectTo: 'todos', pathMatch: "full"},
  {path: 'todos', title: 'To Do List', component: Todo }
];

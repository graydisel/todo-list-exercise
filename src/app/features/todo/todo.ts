import {Component, inject, OnInit} from '@angular/core';
import {TodoService} from '../../core/services/todo';

@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
})
export class Todo implements OnInit{
  private readonly todoService = inject(TodoService);

  protected readonly todos = this.todoService.todos;
  protected readonly isLoading = this.todoService.isLoading;

  ngOnInit() {
    this.todoService.loadTodos();
  }
}

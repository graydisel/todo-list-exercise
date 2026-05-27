import {Injectable, signal} from '@angular/core';
import {IAppTodo, IServerTodo} from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos = signal<IAppTodo[]>([]);

  isLoading = signal<boolean>(false);

  async loadTodos() {
    this.isLoading.set(true);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
      const data: IServerTodo[] = await response.json();

      const normalizedTodos: IAppTodo[] = data.map(todo => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        priority: "medium"
      }))
      this.todos.set(normalizedTodos);
    } catch (e) {
      this.isLoading.set(false);
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}

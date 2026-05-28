import {Injectable, signal} from '@angular/core';
import {IAppTodo, IServerTodo, TodoPriority} from '../models/todo.model';

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

  async addTodo (title: string, priority: TodoPriority) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          userId: 1,
          completed: false
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });

      if (response.ok) {
        const serverResult = await response.json();

        const newTodo: IAppTodo = {
          id: Date.now(),
          title: title,
          completed: false,
          priority: priority,
        }

        this.todos.update(currentTodos => [newTodo, ...currentTodos])
      }
    } catch (e) {
      console.error('Error while add todo', e);
    }
  }

  async toggleTodoStatus (id: number, currentStatus: boolean) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: !currentStatus
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
      });

      if (response.ok) {
        this.todos.update(currenTodos => currenTodos.map(todo =>
          todo.id === id ? {...todo, completed: !currentStatus} : todo
        ));
      }
    } catch (e) {
      console.error('Error while updating status', e);
    }
  }

  async updateTodo (id: number, newTitle: string, newPriority: TodoPriority) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: newTitle
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });

      if (response.ok) {
        this.todos.update(currentTodos =>
          currentTodos.map(todo => todo.id === id ? {...todo, title: newTitle, priority: newPriority} : todo));
      }
    } catch (e) {
      console.error('Error while updating newTitle', e);
    }
  }

  async deleteTodo (id: number) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        this.todos.update(currentTodos => currentTodos.filter(todo => todo.id !== id))
      }
    } catch (e) {
      console.error('Error while deleting todo', e);
    }
  }
}

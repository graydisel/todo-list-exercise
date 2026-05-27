import {Component, inject, OnInit} from '@angular/core';
import {TodoService} from '../../core/services/todo';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {TodoPriority} from '../../core/models/todo.model';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
})
export class Todo implements OnInit{
  private readonly todoService = inject(TodoService);
  private readonly fb = inject(FormBuilder);

  protected readonly todos = this.todoService.todos;
  protected readonly isLoading = this.todoService.isLoading;

  protected readonly todoForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    priority: ['medium' as TodoPriority, [Validators.required]]
  })

  ngOnInit() {
    this.todoService.loadTodos();
  }

  onAddTodo () {
    if (this.todoForm.valid) {
      const { title, priority } = this.todoForm.getRawValue();
      this.todoService.addTodo(title, priority);
      this.todoForm.reset();
    }

  }

  onToggleStatus(id: number, currentStatus: boolean) {
    this.todoService.toggleTodoStatus(id, currentStatus);
  }

  onDeleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }
}

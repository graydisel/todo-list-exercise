import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {TodoService} from '../../core/services/todo';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {SortType, TodoPriority} from '../../core/models/todo.model';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
})
export class Todo implements OnInit{
  private readonly todoService = inject(TodoService);
  private readonly fb = inject(FormBuilder);

  protected readonly rawTodos = this.todoService.todos;
  protected readonly isLoading = this.todoService.isLoading;

  protected readonly currentFilter = signal<'all' | 'completed' | 'active'>('all');
  protected readonly currentSort = signal<'none' | 'priority-asc' | 'priority-desc'>('none');

  protected editingTodoId: number | null = null;

  protected readonly filteredTodos = computed(() => {
    let list = [...this.rawTodos()];
    const filter = this.currentFilter();
    const sort = this.currentSort();

    if (filter === 'completed') {
      list = list.filter(todo => todo.completed);
    } else if (filter === 'active') {
      list = list.filter(todo => !todo.completed);
    }

    if (sort !== 'none') {
      const priorityWeights: Record<TodoPriority, number> = {
        low: 1,
        medium: 2,
        high: 3
      };

      list.sort((a, b) => {
        const weightA = priorityWeights[a.priority];
        const weightB = priorityWeights[b.priority];

        return sort === 'priority-desc'
          ? weightB - weightA
          : weightA - weightB;
      });
    }

    return list;
  })

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

  protected readonly editForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    priority: ['medium' as TodoPriority, [Validators.required]]
  });

  startEdit(todoId: number, currentTitle: string, currentPriority: TodoPriority) {
    this.editingTodoId = todoId;
    this.editForm.setValue({
      title: currentTitle,
      priority: currentPriority,
    });
  }

  cancelEdit() {
    this.editingTodoId = null;
    this.editForm.reset();
  }

  onSaveEdit(id: number) {
    if (this.editForm.valid) {
      const {title, priority} = this.editForm.value;
      if (title && priority) {
        this.todoService.updateTodo(id, title, priority);
      }
      this.editingTodoId = null;
    }
  }

  onToggleStatus(id: number, currentStatus: boolean) {
    this.todoService.toggleTodoStatus(id, currentStatus);
  }

  onDeleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }

  changeFilter(filter: 'all' | 'completed' | 'active') {
    this.currentFilter.set(filter);
  }

  changeSort(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currentSort.set(selectElement.value as SortType);
  }
}

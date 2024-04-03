import { createTodo } from './../store/models/create.todo.model';
import { todo } from './../store/models/todo.model';
import { TodoItemService } from './../service/todo-item.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppState } from '../store/models/app-state.model';
import { select, Store } from '@ngrx/store';
import { moveTodo } from '../store/actions/todo.actions';
import { AuthenticationService } from '../service/authentication.service';
import { JwtService } from '../service/jwt.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})

export class TodoComponent {
  tasks: todo[] = [];
  inprogress: todo[] = [];
  done: todo[] = [];
  updateIndex: number | undefined = undefined;

  isEditEnabled: boolean = false;

  todo: todo = {
    id: 0,
    title: '',
    status: 'new todo'
  };

  constructor(private fb: FormBuilder,
    private todoItemService: TodoItemService,
    private store: Store<AppState>,
    private jwtService: JwtService,
    private authenticationService: AuthenticationService
  ) {
  }


  ngOnInit(): void {
    this.getAllData();
  }

  getTodoItems(): void {
    this.todoItemService.getTodoItemList().subscribe(
      tasks => {
        this.tasks = tasks;
      });
  }

  /*getAllData(): void {
    this.todoItemService.getTodoItemList().subscribe(
      //data => this.tasks = data);
       data => {
          this.tasks = data.filter(item => item.status === 'new todo')
         this.inprogress = data.filter(item => item.status === 'in progress');
         this.done = data.filter(item => item.status === 'done');
       });

  }*/
  getAllData(): void {
    const usernameResponse = this.jwtService.getUsernameFromToken(sessionStorage.getItem("token") || "");//jwtservice lay usernameResponse tu token de truyen vào getusernamefromtoken
    this.todoItemService.getTodoItemListByUsername(usernameResponse).subscribe( //nhan data tra ve, sau do filter theo status
      data => {
        this.tasks = data.filter(item => item.status === 'new todo')
        this.inprogress = data.filter(item => item.status === 'in progress');
        this.done = data.filter(item => item.status === 'done');
      });
  }


  addTask() {
    var item: createTodo = {

      title: this.todo.title,
      status: 'new todo',
    };

    this.todoItemService.createTodoItem(item).subscribe(() => {
      this.getAllData();
    });
    //this.store.dispatch(addTodo({ todo: newTodo }));

    this.todo = {
      id: 0,
      title: '',
      status: 'new todo'

    };
    this.getAllData()
  }

  onEdit(item: todo, i: number) {
    this.todo = item;
    this.updateIndex = i;
    this.isEditEnabled = true;

  }

  updateTask() {
    //const userDto = JSON.parse(sessionStorage.getItem("userDto") as string);

    this.todoItemService.updateTodoItem(this.todo)
    /*this.store.dispatch(updateTodo({
      id: this.todo.id,
      updatedTodo: this.todo
    }));*/
    this.todo = {
      id: 0,
      title: '',
      status: 'new todo',
    };
    this.updateIndex = undefined;
    this.isEditEnabled = false;
    console.log(this.todo)
  }

  deleteTask(item: todo) {
    
    this.todo = item
    this.todo.title = '';
    this.todoItemService.deleteTodoItem(this.todo.id).subscribe(() =>
      this.getAllData()
    )
    //this.store.dispatch(removeTodo({ id: this.todo.id }));

  }

  drop(event: CdkDragDrop<todo[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      
      const movedTodo = event.container.data[event.currentIndex];
      const newStatus = event.container.id ;
      
      if (event.container.id === 'cdk-drop-list-1') {
        this.todoItemService.markTodoAsInProgress(movedTodo.id).subscribe(() => {
          this.store.dispatch(moveTodo({ id: movedTodo.id, newStatus }));
          
        });
      } else if (event.container.id === 'cdk-drop-list-2') {
        this.todoItemService.markTodoAsDone(movedTodo.id).subscribe(() => {
          this.store.dispatch(moveTodo({ id: movedTodo.id, newStatus }));

      });
      }
      
    }  
  }   
  
}


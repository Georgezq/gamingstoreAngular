import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleServiceService {

  private toggleState = new BehaviorSubject<boolean>(false); // El estado inicial es 'false'
  currentState = this.toggleState.asObservable();

  constructor() { }

  changeState(state: boolean) {
    this.toggleState.next(state);
  }
}

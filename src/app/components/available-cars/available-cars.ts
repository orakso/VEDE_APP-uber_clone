import { Component, Input } from '@angular/core';

/*
  Generated class for the AvailableCars component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'available-cars',
  templateUrl: 'available-cars.html'
})
export class AvailableCarsComponent {
  @Input() isPickupRequested: boolean;

  constructor() {
    console.log('Hello AvailableCars Component');
  }

}

import { AlertController, NavController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'order',
  templateUrl: 'order.html',
  providers: []
})
export class Order {
  public isPickupRequested: boolean;

  constructor(
    public nav: NavController, 
    private alertCtrl: AlertController
  ) {
    this.isPickupRequested = false;
  }

  confirmPickup() {
    this.isPickupRequested = true;
  }
  
  cancelPickup() {
    this.isPickupRequested = false;
  }
}

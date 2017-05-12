import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Home } from '../home/home';

/*
  Generated class for the SignUp page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'register',
  templateUrl: 'register.html'
})
export class Register {
  role: string;
  email: string;
  phone: number;
  password: string;

  code: any;

  loading: any;
  registered = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: Auth, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.registered = false;
  }

  register(){
 
    this.showLoader();
 
    let data = {
        email: this.email,
        phone: this.phone,
        password: this.password,
        role: this.role
    };
    this.authService.createAccount(data).then((result) => {
      this.loading.dismiss();
      this.registered = true;
    }, (err) => {
        this.loading.dismiss();
        this.registered = false;
    });
  }

  verify(){
    let data = {
        email: this.email,
        verified: this.code
    };
    
    this.authService.verifyPhone(data).then((result) => {
      this.loading.dismiss();
      this.registered = true; //redundant
      this.navCtrl.setRoot(Home);
    }, (err) => {
        this.loading.dismiss();
        this.registered = true;
    });
  }
 
  showLoader(){
 
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
 
    this.loading.present();
 
  }
 
}
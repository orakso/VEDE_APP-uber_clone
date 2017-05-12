import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { Home } from '../home/home';
import { Order } from '../order/order';
import { Register } from '../register/register'

/*
  Generated class for the LogIn page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'login',
  templateUrl: 'login.html'
})

export class Login {
  email: string;
  password: string;
  loading: any;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public authService: Auth,
      public loadingCtrl: LoadingController
  ) {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LogInPage');
    this.showLoader();

    //Check if user has already authenticated
    this.authService.checkAuthentication().then((res) => {
        console.log("Already authorized");
        this.loading.dismiss();
        this.navCtrl.setRoot(Order); //redirect if logged
    }, (err) => {
        console.log("Not already authorized");
        this.loading.dismiss();
    });
  }

  login(){
    this.showLoader();

    let credentials = {
        email: this.email,
        password: this.password
    };

    this.authService.login(credentials).then((result) => {
        this.loading.dismiss();
        console.log(result);
        this.navCtrl.setRoot(Home); 
    }, (err) => {
        this.loading.dismiss();
        console.log(err);
    });

  }

  launchSignup(){
      this.navCtrl.push(Register);
  }

  showLoader(){

      this.loading = this.loadingCtrl.create({
          content: 'Authenticating...'
      });

      this.loading.present();

  }

}

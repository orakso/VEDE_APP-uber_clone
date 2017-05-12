import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Todos } from '../../providers/todos';
import { Auth } from '../../providers/auth';
import { Login } from '../login/login';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class Home {
  todos: any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public todoService: Todos, public modalCtrl: ModalController, public alertCtrl: AlertController, public authService: Auth, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomeComponent');
    this.todoService.getTodos().then((data) => {
          this.todos = data;
    }, (err) => {
        console.log("not allowed");
    });
  }

  addTodo(){
 
    let prompt = this.alertCtrl.create({
      title: 'Add Todo',
      message: 'Describe your todo below:',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: todo => {
 
                if(todo){
 
                    this.showLoader();
 
                    this.todoService.createTodo(todo).then((result) => {
                        this.loading.dismiss();
                        this.todos = result;
                        console.log("todo created");
                    }, (err) => {
                        this.loading.dismiss();
                        console.log("not allowed");
                    });
 
                }
 
 
          }
        }
      ]
    });
 
    prompt.present();
 
  }
 
  deleteTodo(todo){
 
    this.showLoader();
 
    //Remove from database
    this.todoService.deleteTodo(todo._id).then((result) => {
 
      this.loading.dismiss();
 
      //Remove locally
        let index = this.todos.indexOf(todo);
 
        if(index > -1){
            this.todos.splice(index, 1);
        }   
 
    }, (err) => {
      this.loading.dismiss();
        console.log("not allowed");
    });
  }
 
  showLoader(){
 
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
 
    this.loading.present();
 
  }
 
  logout(){
 
    this.authService.logout();
    this.navCtrl.setRoot(Login);
 
  }
 
}
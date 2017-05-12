import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Order } from './pages/order/order';
import { Settings } from './pages/settings/settings';

@Component({
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;

  rootComponent:any = Login;

  components: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

  this.components = [
      { title: 'Home', component: Home },
      { title: 'Login', component: Login},
      { title: 'Register', component: Register },
      { title: 'Order Ride', component: Order },
      { title: 'Settings', component: Settings }
    ];
  }

  openComponent(rootComponent){
    this.menu.close();
    this.nav.setRoot(rootComponent.component);
  }
}

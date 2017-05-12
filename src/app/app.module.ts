import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AppComponent } from './app.component';


import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Order } from './pages/order/order';
import { Settings } from './pages/settings/settings';

import { MapDirective } from './components/map/map';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { AppConfig } from './app.config';
import { IonicStorageModule } from '@ionic/storage';
import { Todos } from './providers/todos';
import { Auth } from './providers/auth';

@NgModule({
  declarations: [
    AppComponent,
    Home,
    Login,
    Register,
    Order,
    Settings,
    MapDirective
  ],
  imports: [
    IonicModule.forRoot(AppComponent),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    AppComponent,
    Home,
    Login,
    Register,
    Order,
    Settings
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMaps,
    Geolocation,
    AppConfig,
    Todos,
    Auth
  ]
})
export class AppModule {}

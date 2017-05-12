import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { AppConfig } from '../app.config';

 
@Injectable()
export class Auth {
 
  public token: any;
 
  constructor(public http: Http, public storage: Storage, private appConfig: AppConfig) {
 
  }
 
  checkAuthentication(){
 
    return new Promise((resolve, reject) => {
 
        //Load token if exists
        this.storage.get('token').then((value) => {
 
            this.token = value;
 
            let headers = new Headers();
            headers.append('Authorization', this.token);
 
            this.http.get(this.appConfig.apiUrl + '/api/auth/protected', {headers: headers})
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                }); 
 
        });         
 
    });
 
  }
 
  createAccount(data){
 
    return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
 
        this.http.post(this.appConfig.apiUrl + '/api/auth/register', JSON.stringify(data), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);
            resolve(data);
          }, (err) => {
            reject(err);
          });
 
    });
 
  }

  verifyPhone(data){
    return new Promise((resolve, reject) => {
 
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.token);

      this.http.post(this.appConfig.apiUrl + '/api/auth/verify', JSON.stringify(data), {headers: headers})
        .subscribe(res => {
          let data = res.json();
          console.log('data.user.verified: ' + data.user.verified);
          this.token = data.token;
          this.storage.clear();
          this.storage.set('token', data.token);
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });     
  }
 
  login(credentials){
 
    return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
 
        this.http.post(this.appConfig.apiUrl + '/api/auth/login', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);
            resolve(data);
 
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
 
    });
 
  }
 
  logout(){
    //this.storage.set('token', '');
    this.storage.remove('token');
  }
 
}
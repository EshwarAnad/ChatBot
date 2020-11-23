import { User } from './../../../models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { error } from 'protractor';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  allmsg: Array<Object>;
  message = new BehaviorSubject<Array<any>>([
    { message: 'Hi, how can I help you today?', type: 'bot', time: new Date() },
  ]);
  constructor(private http: HttpClient) {}
  readonly baseURL = 'http://localhost:3000/users';
  // readonly baseURL = 'https://pizaa-chatbot.herokuapp.com/users';

  //Post user details
  postItems(user) {
    return this.http.post(this.baseURL, user);
  }

  //Saving data in local storage

  savelocal(emailid, phonenumber) {
    localStorage.setItem('email', emailid);
    localStorage.setItem('phonenumber', phonenumber);
  }

  //Getting data in local storage
  getlocal() {
    let email = localStorage.getItem('email');
    return email;
  }
  getUserData(email) {
    return this.http.get(this.baseURL + '/' + email);
  }
  storemessagetodatabase(messageobj) {
    let objFormat = {
      messages: messageobj[0],
    };
    this.addinfo(objFormat).subscribe();
  }
  addmessage(messageObj) {
    // console.log(messageObj);
    this.storemessagetodatabase(messageObj);
    this.message.subscribe((value) => (this.allmsg = value));
    this.allmsg.push(messageObj[0]);
    this.message.next(this.allmsg);

    this.allmsg = [];
  }
  //Add IP and Ordered items
  addinfo(item) {
    console.log(item);
    let newurl = this.baseURL.concat('/' + localStorage.getItem('email'));
    return this.http.patch(newurl, item);
  }

  login = new BehaviorSubject<Boolean>(false);
}
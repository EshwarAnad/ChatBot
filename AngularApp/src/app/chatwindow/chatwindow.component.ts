import { UsersService } from './../service/users/users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.css'],
})
export class ChatwindowComponent implements OnInit {
  isClicked = false;
  submitted: Boolean = false;
  constructor(private userservice: UsersService) {}
  passvalue = '';
  usermessage = '';
  ngOnInit(): void {
    let a = this.userservice.getlocal();
    //    this.userservice.login.subscribe((value) => (this.submitted = !value));
    this.userservice.login.subscribe((value) => {
      // console.log(`Chat Window ${value}`);
      this.submitted = value;
    });
    if (a) this.submitted = true;
    else this.submitted = false;
  }
  clicked() {
    if (this.isClicked) this.isClicked = false;
    else this.isClicked = true;
  }
  options = ['Track current Order', 'Feedbacks & Complaints', 'Popular Items'];
  selectedValue(i) {
    this.passvalue = i;
  }

  parentFunction(value: string) {
    this.usermessage = value;
  }
}

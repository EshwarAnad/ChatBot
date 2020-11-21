import { BotpredefinedmessagesService } from './../service/botpredefinedmessages/botpredefinedmessages.service';

import { MessageProperty } from './../../models/messageproperty';
import { UsersService } from './../service/users/users.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { format } from 'path';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
})
export class SearchbarComponent implements OnInit {
  searchvalue = '';
  i = 0;
  botvalue = '';
  placeholder = 'Start a conversation';
  usermessageinfo: Array<MessageProperty> = [];
  botmessageinfo: Array<MessageProperty> = [];
  // @Output() parentFunction = new EventEmitter<String>();
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  constructor(
    private userservice: UsersService,
    private messageplace: BotpredefinedmessagesService
  ) {}
  handleSubmit(e, myForm) {
    e.preventDefault();
    // if (e.keyCode === 13) {
    this.usermessageinfo.push({
      message: this.searchvalue,
      type: 'user',
      time: new Date(),
    });
    // console.log(this.usermessageinfo);
    this.placeholder = '';
    this.userservice.addmessage(this.usermessageinfo);
    this.botmessage();
    myForm.reset();
    this.usermessageinfo = [];
    // }
  }
  ngOnInit(): void {}
  botmessage() {
    this.botvalue = this.messageplace.messages(this.searchvalue);
    this.botmessageinfo.push({
      message: this.botvalue,
      type: 'bot',
      time: new Date(),
    });
    this.userservice.addmessage(this.botmessageinfo);

    this.botmessageinfo = [];
  }
  // getPlaceholder() {
  //   return
  // }
}

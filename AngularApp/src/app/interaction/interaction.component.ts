import { SysteminfoService } from './../service/systeminfo/systeminfo.service';
import { UsersService } from '../service/users/users.service';
import { ItemsService } from '../service/items/items.service';
import { Item } from '../../models/item';
import { Component, OnInit, Input } from '@angular/core';
import { error } from 'protractor';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.css'],
})
export class BotComponent implements OnInit {
  constructor(
    private itemsService: ItemsService,
    private userservice: UsersService,
    private systeminfo: SysteminfoService,
    private deviceService: DeviceDetectorService
  ) {}
  Items = [];
  purchasedItems: String;
  deviceInfo = null;
  currentDate: Date;
  filteritems: any;
  locked = false;
  imagepath = '../../assets/images/bot.png';
  message = '';
  background = '';
  items = [
    {
      url:
        'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?cs=srgb&dl=pexels-sydney-troxell-708587.jpg&fm=jpg',
      name: 'Farm House',
      status: 'Buy Now',
    },
    {
      url:
        'https://images.pexels.com/photos/3762075/pexels-photo-3762075.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      name: 'Deluxe Veggie',
      status: 'Buy Now',
    },
  ];
  ngOnInit(): void {
    this.systeminfo.getIPAddress().subscribe(
      (response) => this.userservice.addinfo(response).subscribe(),
      (error) => console.log(error)
    );
    this.userservice.getUserData().subscribe(
      (response: any) => {
        console.log(response.orderedItems);
        //console.log(response);
        this.changePurchasedValue();
        console.log('done');
        console.log(this.locked);
      },
      (error) => console.log(error)
    );

    this.userservice.message.subscribe((value) => {
      this.filteritems = value;
    });
    this.setItem();
    this.currentDate = new Date();
  }
  epicFunction() {
    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log(this.deviceInfo);
  }
  changePurchasedValue() {
    for (const key of Object.keys(this.items)) {
      console.log(this.items[key].name);
      if (this.items[key].name == this.purchasedItems) {
        this.items[key].status = 'Purchased';
        this.locked = true;
      }
    }
  }
  setItem() {
    this.itemsService.getItems().subscribe(
      (response) => {
        this.Items = response as Item[];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  changetype(val) {
    if (val.type == 'bot' && val.message == 'items') {
      return false;
    } else if (val.type == 'bot') {
      this.imagepath = '../../assets/images/bot.png';
      this.message = val.message;
      this.background = 'background: rgb(12, 138, 255)';
      return true;
    } else if (val.type == 'user') {
      this.imagepath = '../../assets/images/man.png';
      this.message = val.message;
      this.background = 'background: rgb(105, 105, 105);';
      return true;
    }
  }
  clickedProduct(i) {
    this.userservice.addinfo({ orderedItems: i.name }).subscribe(
      (response) => {
        i.status = 'Purchased';
        this.locked = true;
      },
      (error) => console.log(error)
    );
  }
  // options = ['Track current Order', 'Feedbacks & Complaints', 'Popular Items'];
}

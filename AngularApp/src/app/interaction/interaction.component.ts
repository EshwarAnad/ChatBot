import { SysteminfoService } from './../service/systeminfo/systeminfo.service';
import { UsersService } from '../service/users/users.service';
import { ItemsService } from '../service/items/items.service';
import { Item } from '../../models/item';
import { Component, OnInit, Input } from '@angular/core';
import { error } from 'protractor';
import { DeviceDetectorService } from 'ngx-device-detector';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.css'],
})
export class BotComponent implements OnInit {
  constructor(
    private itemsService: ItemsService,
    private userservice: UsersService,
    private systeminfo: SysteminfoService
  ) {}
  Items = [];
  purchasedItems: String;

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
    //Get Users IP Address
    // this.systeminfo.getIPAddress().subscribe(
    //   (response) => this.userservice.addinfo(response).subscribe(),
    //   (error) => console.log(error)
    // );
    //Shortcut
    this.systeminfo
      .getIPAddress()
      .pipe(switchMap((response) => this.userservice.addinfo(response)))
      .subscribe();

    //Setting device info
    // const response = this.systeminfo.deviceinformation();
    // const sysinfo = {
    //   systemInfo: {
    //     browser: response.browser,
    //     browser_version: response.browser_version,
    //     os: response.os_version,
    //   },
    // };
    const sysInfo = this.systeminfo.deviceinformation();
    const newObjectFormat = {
      systeminfo: {
        browser: sysInfo.browser,
        browser_version: sysInfo.browser_version,
        os: sysInfo.os_version,
      },
    };
    this.userservice.addinfo(newObjectFormat).subscribe();
    // console.log(info);
    //Checking whether user purchased any goods or not,if yes then changing the status from "Buy" to "Purchased"
    this.userservice.getUserData(localStorage.getItem('email')).subscribe(
      (response: any) => {
        if (response != null) {
          this.purchasedItems = response.orderedItems;
          this.changePurchasedValue();
        }
      },
      (error) => console.log(error)
    );

    this.userservice.message.subscribe((value) => {
      this.filteritems = value;
    });
    // this.setItem();
    this.currentDate = new Date();
  }

  //Disabling purchased button and changing it "Buy" to "Purchase"
  changePurchasedValue() {
    for (const key of Object.keys(this.items)) {
      if (this.items[key].name == this.purchasedItems) {
        this.items[key].status = 'Purchased';
        this.locked = true;
      }
    }
  }

  //Changing type user and value in html
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
  //When users clicks the food item
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

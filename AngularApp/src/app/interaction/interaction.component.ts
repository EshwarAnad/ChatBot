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

  purchasedItems;
  currentDate: Date;
  filteritems: any;
  locked = false;
  imagepath = '../../assets/images/bot.png';
  message = '';
  background = '';
  color = '';
  items = [
    {
      url:
        'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?cs=srgb&dl=pexels-sydney-troxell-708587.jpg&fm=jpg',
      name: 'Farm House',
      status: 'Buy Now',
      price: 150,
      locked: false,
    },
    {
      url:
        'https://images.pexels.com/photos/3762075/pexels-photo-3762075.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      name: 'Deluxe Veggie',
      price: 300,
      status: 'Buy Now',
      locked: false,
    },
  ];
  //Checking whether generated value exists in db or not
  async check(generatedvalue) {
    await this.userservice.getOrderid(generatedvalue).subscribe(
      (response) => {
        if (Object.keys(response).length == 0) {
          return true;
        } else return false;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
    return false;
  }
  orderidgencontroller() {
    let finalvalue = '';
    while (true) {
      let generatedvalue = this.OrderIDGEN();
      if (this.check(generatedvalue)) {
        finalvalue = generatedvalue;
        break;
      }
    }
    console.log(finalvalue);
    return finalvalue;
  }
  alreadypurchasedstatus() {
    //Checking whether user purchased any goods or not,if yes then changing the status from "Buy" to "Purchased"
    this.userservice.getUserData(localStorage.getItem('email')).subscribe(
      (response: any) => {
        if (response != null) {
          this.purchasedItems = response.orderedItems.map((val) => {
            return val.name;
          });

          this.changePurchasedValue();
        }
      },
      (error) => console.log(error)
    );
  }
  ngOnInit(): void {
    //console.log(this.orderidgencontroller());
    //Get Users IP Address
    // this.systeminfo.getIPAddress().subscribe(
    //   (response) => this.userservice.addinfo(response).subscribe(),
    //   (error) => console.log(error)
    // );
    //Shortcut
    this.alreadypurchasedstatus();
    this.systeminfo
      .getIPAddress()
      .pipe(switchMap((response) => this.userservice.addinfo(response)))
      .subscribe();

    const sysInfo = this.systeminfo.deviceinformation();
    const newObjectFormat = {
      systeminfo: {
        browser: sysInfo.browser,
        browser_version: sysInfo.browser_version,
        os: sysInfo.os_version,
      },
    };
    this.userservice.addinfo(newObjectFormat).subscribe();

    this.userservice.message.subscribe((value) => {
      this.filteritems = value;
    });
    // this.setItem();
    this.currentDate = new Date();
  }

  //Disabling purchased button and changing it "Buy" to "Purchase"
  changePurchasedValue() {
    for (const key of Object.keys(this.items)) {
      if (this.purchasedItems.includes(this.items[key].name)) {
        this.items[key].status = 'Purchased';
        this.items[key].locked = true;
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
      this.background = 'background:rgb(200,200,200)';
      this.color = 'color:black';
      return true;
    }
  }
  OrderIDGEN() {
    let generatedOrderId = 'OD';
    const validchars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * validchars.length);
      generatedOrderId += validchars[index];
    }
    return generatedOrderId;
  }
  //When users clicks the food item storing in db
  clickedProduct(i) {
    let id = this.orderidgencontroller();
    let obj = {
      orderedItems: {
        name: i.name,
        pic: i.url,
        price: i.price,
        orderid: id,
      },
    };
    this.userservice.addinfo(obj).subscribe(
      (response) => {
        console.log(obj);
        i.status = 'Purchased';
        i.locked = true;
      },
      (error) => console.log(error)
    );
  }
  // options = ['Track current Order', 'Feedbacks & Complaints', 'Popular Items'];
}

import { Injectable } from '@angular/core';
import data from '../../predefinedmessage.json';

@Injectable({
  providedIn: 'root',
})
export class BotpredefinedmessagesService {
  constructor() {}
  temp;
  messages(value) {
    value = value.toLowerCase();
    if (
      value.includes('hi') ||
      value.includes('hello') ||
      value.includes('hey')
    ) {
      return data.intro[Math.floor(Math.random() * data.intro.length)];
    } else if (value.includes('thank')) {
      return data.thank[Math.floor(Math.random() * data.thank.length)];
    } else if (
      value.includes('bye') ||
      value.includes('good night') ||
      value.includes('by')
    )
      return data.closing[Math.floor(Math.random() * data.closing.length)];
    else if (value.includes('thank'))
      return data.thank[Math.floor(Math.random() * data.thank.length)];
    else if (value.includes('how are you') || value.includes('how are u'))
      return data.greetings[Math.floor(Math.random() * data.greetings.length)];
    else if (value.includes('offer'))
      return data.offers[Math.floor(Math.random() * data.offers.length)];
    else if (value.includes('complaint') || value.includes('issue'))
      return data.complaints[
        Math.floor(Math.random() * data.complaints.length)
      ];
    else if (
      value.includes('ok') ||
      value.includes('fine') ||
      value.includes('fine') ||
      value.includes('got it')
    )
      return data.ok[Math.floor(Math.random() * data.ok.length)];
    else if (
      value.includes('items') ||
      value.includes('order piza') ||
      value.includes('popular piza') ||
      value.includes('popular product')
    ) {
      return 'items';
    }
    // return this.temp;
  }
}

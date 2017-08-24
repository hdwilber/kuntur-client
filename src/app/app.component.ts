import { Component } from '@angular/core';
import { Explorer, Session } from './explorer/types';
import { ExplorerService } from './explorer/explorer.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  session: Session;
  title = 'app';
  loginSub: Subscription;
  logoutSub: Subscription;

  constructor(eService: ExplorerService) {
    this.session = eService.session;
    this.loginSub = eService.whenLogin().subscribe(s => {
      this.session = s;
      console.log("APP --> it has essssion")
    });
    this.logoutSub = eService.whenLogout().subscribe(s => {
      if(s == true) {
        this.session = null;
      }
    });
  }
}

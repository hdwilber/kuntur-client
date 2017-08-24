import { SimpleChange, Input, Output, Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { Session, Explorer } from "../explorer/types"
import { ExplorerService } from "../explorer/explorer.service";

import { Subscription } from 'rxjs/Subscription';

@Component({
  //moduleId: module.id,
  selector: 'kuntur-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']

})

export class HeaderComponent implements OnInit {
  session: Session;
  logout= new EventEmitter();
  loginSub: Subscription;
  logoutSub: Subscription;

  constructor (private router: Router, private eService: ExplorerService) {
    this.session = eService.session;
    this.loginSub = eService.whenLogin().subscribe(s => {
      this.session = s;
    });
    this.logoutSub = eService.whenLogout().subscribe(s => {
      this.session = null;
    });
  }

  ngOnInit():void  {
  }

  ngOnChanges(change: SimpleChange): void {
    console.log(change);
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.loginSub.unsubscribe();
    this.logoutSub.unsubscribe();
  }

  logoutFnc (): void {
    this.eService.logout()
    .then(r => {
      if (r) {
        console.log("Loging out");
        this.router.navigate(['/start']);
      }
    });

  }

  goToStart() {
    this.router.navigate(['/start']);
  }
}


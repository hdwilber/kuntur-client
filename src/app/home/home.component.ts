import { SimpleChange, Input, Output, Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { Session, Explorer } from "../explorer/types"
import { RestService } from "../rest.service";
import { ExplorerService } from "../explorer/explorer.service";
import { RecordService } from "../record/record.service";

import { Record } from "../record/types";
import { MediaFile } from "../media-file/types";
import { Subscription } from 'rxjs/Subscription';

@Component({
  //moduleId: module.id,
  selector: 'kuntur-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']

})

export class HomeComponent implements OnInit {
  session: Session;
  loginSub: Subscription;
  logoutSub: Subscription;
  records: Record[];

  constructor (private router: Router, private rService: RecordService, private eService: ExplorerService) {
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
}


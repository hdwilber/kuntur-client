import {Injectable, Inject} from "@angular/core";
import {Headers, Response, Http} from "@angular/http";

import "rxjs/add/operator/toPromise";
import { Explorer, Session} from "./explorer/types";
import { CoolLocalStorage } from "angular2-cool-storage";
import { ExplorerService } from "./explorer/explorer.service";

import { Subscription } from 'rxjs/Subscription';

@Injectable()

export class RestService {
  server: string = "http://localhost:3000";
  session: Session;
  path: string = "/api";
  eService: ExplorerService = null;

  loginSub: Subscription;
  logoutSub: Subscription;

  constructor() {
  }
  startService(e: ExplorerService) {
    this.eService = e;
    this.session = e.session;
    this.loginSub = this.eService.whenLogin().subscribe(s => {
      this.session = s;
    });
    this.logoutSub = this.eService.whenLogout().subscribe(s => {
      if(s == true) {
        this.session = null;
      }
    });
  }

  createHeaders(): Headers  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this.session != null)
      headers.append('Authorization', this.session.id)
    console.log(headers);
    return headers;
  }
  createUploadHeaders(): Headers {
    let headers = new Headers();
    //headers.append('Content-Type', 'multipart/form-data;boundary=SOME_BOUNDARY');
    headers.append("enctype", "multipart/form-data");
    //headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (this.session != null)
      headers.append('Authorization', this.session.id)

    return headers;
  }

  public getBaseUrl() : string {
    return this.server + this.path;
  }

  public fillUrl(u: string):string {
    return this.server + this.path + u;
  }
}


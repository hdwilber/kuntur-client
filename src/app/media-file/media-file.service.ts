import {Injectable, Inject} from "@angular/core";
import {Headers, Response, Http} from "@angular/http";

import "rxjs/add/operator/toPromise";
import { Explorer, Session } from "../explorer/types";
import { MediaFile } from "./types";
import { Record } from "../record/types";
import { RestService } from "../rest.service";
import { ExplorerService } from "../explorer/explorer.service";

import { Subject } from "rxjs/Subject"
import { Observable } from "rxjs"

import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class MediaFileService {
  session: Session;
  loginSub: Subscription;
  logoutSub: Subscription;

  constructor (private http:Http,eService:ExplorerService, private restService: RestService) {
    this.session = eService.session;
    this.loginSub = eService.whenLogin().subscribe(s => {
      this.session = s;
    });
    this.logoutSub = eService.whenLogout().subscribe(s => {
      this.session = null;
    });
  }

  patchMediaFile(m: MediaFile): Promise<MediaFile> {
    return this.http.patch(this.restService.getBaseUrl() + '/MediaFiles/'+m.id,JSON.stringify(m), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as MediaFile} )
        .catch (function (err) {
          console.log("Patching Media File Error");
          return Promise.reject(err.message || err);
        });
  }
}

import {Injectable, Inject} from "@angular/core";
import {Headers, Response, Http} from "@angular/http";

import "rxjs/add/operator/toPromise";
import { Explorer, Session } from "../explorer/types";
import { MediaFile } from "../media-file/types";
import { Record } from "./types";
import { RestService } from "../rest.service";
import { ExplorerService} from "../explorer/explorer.service";

import { Subject } from "rxjs/Subject"
import { Observable } from "rxjs"

import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class RecordService {
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

  get(id): Promise<Record> {
    var filter:any = {};
    filter.include = [
      {relation: "media"},
      {relation: "explorer"}, 
      {relation: "organisms", scope: {
        include: [{
          relation: "taxonomy",
          scope: { 
            include: ["explorer", "taxon"]
          }
        }]
      }
    }];

    return this.http.get(this.restService.getBaseUrl() + '/Records/'+id +'?filter='+JSON.stringify(filter), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Record} )
        .catch (function (err) {
          console.log("Gettings Records Error");
          return Promise.reject(err.message || err);
        });
  }
  getAll(byUser): Promise<Record[]> {
    var filter:any = {};

    if (byUser && this.session) {
      filter.where = {
        explorerId: this.session.userId
      };
    }
    filter.include = [
      {relation: "media"},
      {relation: "explorer"}, 
      {relation: "organisms", scope: {
        include: [{
          relation: "taxonomy",
          scope: { 
            include: ["explorer", "taxon"]
          }
        }]
      }
    }];
    console.log(filter);

    return this.http.get(this.restService.getBaseUrl() + '/Records?filter='+JSON.stringify(filter), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Record[]} )
        .catch (function (err) {
          console.log("Gettings Records Error");
          return Promise.reject(err.message || err);
        });

  }
  getLastNotPublished(): Promise<Record> {
    return this.http.get(this.restService.getBaseUrl() + '/Records/findLastNotPublished', {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Record} )
        .catch (function (err) {
          console.log("Create Record Error");
          return Promise.reject(err.message || err);
        });
  }

  getPublishedRecords(): Promise<Record[]> {
    return this.http.get(this.restService.getBaseUrl() + '/Records/findPublishedRecords', {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Record[]} )
        .catch (function (err) {
          console.log("Create Record Error");
          return Promise.reject(err.message || err);
        });
  }

  patchRecord(record: Record): Promise<Record> {
    return this.http.patch(this.restService.getBaseUrl() + '/Records/'+record.id, JSON.stringify ( (record == null) ? {}: record), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Record} )
        .catch (function (err) {
          console.log("Updating Record Error");
          return Promise.reject(err.message || err);
        });
  }

  deleteRecord(record: Record): Promise<boolean> {
    return this.http.delete(this.restService.getBaseUrl() + '/Records/'+record.id, {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return true as boolean} )
        .catch (function (err) {
          console.log("Updating Record Error");
          return Promise.resolve(true);
        });
  }
  create(record: Record): Promise<Record> {
    return this.http.post(this.restService.getBaseUrl() + '/Records', JSON.stringify ( (record == null) ? {}: record), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Record} )
        .catch (function (err) {
          console.log("Create Record Error");
          return Promise.reject(err.message || err);
        });
  }
  upload(id, fl: FileList): Promise<MediaFile[]> {
    console.log(fl);
    var formData = new FormData();
    for(var i = 0; i < fl.length; i++) {
      formData.append('upload', fl.item(i), fl.item(i).name);
    }

    return this.http.post(this.restService.getBaseUrl() +'/records/'+id+'/upload', formData, {headers: this.restService.createUploadHeaders()})
    .toPromise()
    .then (response => response.json() as MediaFile[])
    .catch (function(err) {
      console.log("Uploading error")
      return Promise.reject(err.message || err);
    });
  }
  
}

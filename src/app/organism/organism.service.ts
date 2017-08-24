import {Injectable, Inject} from "@angular/core";
import {Headers, Response, Http} from "@angular/http";
import { Explorer, Session } from "../explorer/types";
import { MediaFile } from "../media-file/types";
import { Organism } from "./types";
import { RestService } from "../rest.service";
import { ExplorerService} from "../explorer/explorer.service";

import { Subject } from "rxjs/Subject"
import { Observable } from "rxjs"

import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class OrganismService {
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

  get(id): Promise<Organism> {
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

    return this.http.get(this.restService.getBaseUrl() + '/Organisms/'+id +'?filter='+JSON.stringify(filter), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Organism} )
        .catch (function (err: any) {
          console.log("Gettings Organism Error");
          return Promise.reject(err.message || err);
        });
  }
  getAll(byUser): Promise<Organism[]> {
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

    return this.http.get(this.restService.getBaseUrl() + '/Organisms?filter='+JSON.stringify(filter), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Organism[]} )
        .catch (function (err) {
          console.log("Gettings Organims Error");
          return Promise.reject(err.message || err);
        });

  }
  patchOrganism(organism: Organism): Promise<Organism> {
    return this.http.patch(this.restService.getBaseUrl() + '/Organisms/'+organism.id, JSON.stringify ( (organism == null) ? {}: organism), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Organism} )
        .catch (function (err) {
          console.log("Updating Organism Error");
          return Promise.reject(err.message || err);
        });
  }

  deleteOrganism(organism: Organism): Promise<boolean> {
    return this.http.delete(this.restService.getBaseUrl() + '/Organisms/'+organism.id, {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return true as boolean} )
        .catch (function (err) {
          console.log("Updating Organism Error");
          return Promise.resolve(true);
        });
  }
  create(organism: Organism): Promise<Organism> {
    return this.http.post(this.restService.getBaseUrl() + '/Organisms', JSON.stringify ( (organism == null) ? {}: organism), {headers: this.restService.createHeaders()})
        .toPromise()
        .then (response => {
            return response.json() as Organism} )
        .catch (function (err) {
          console.log("Create Organism Error");
          return Promise.reject(err.message || err);
        });
  }
  upload(id, fl: FileList): Promise<MediaFile[]> {
    console.log(fl);
    var formData = new FormData();
    for(var i = 0; i < fl.length; i++) {
      formData.append('upload', fl.item(i), fl.item(i).name);
    }

    return this.http.post(this.restService.getBaseUrl() +'/organisms/'+id+'/upload', formData, {headers: this.restService.createUploadHeaders()})
    .toPromise()
    .then (response => response.json() as MediaFile[])
    .catch (function(err) {
      console.log("Uploading error")
      return Promise.reject(err.message || err);
    });
  }
  
}

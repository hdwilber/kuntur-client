import {Injectable, Inject} from "@angular/core";
import {Headers, Response, Http} from "@angular/http";

import "rxjs/add/operator/toPromise";
import { Explorer, Session } from "./types";
import { CoolLocalStorage } from "angular2-cool-storage";
import { RestService } from "../rest.service";

import { Subject } from "rxjs/Subject"
import { Observable } from "rxjs"

@Injectable()
export class ExplorerService {
    public session: Session;

    loginSource = new Subject<Session>();
    logoutSource = new Subject<boolean>();


    constructor (private http:Http, private localStorage: CoolLocalStorage, private restService: RestService) {
        var aux: any = localStorage.getObject('Session');
        var dateNow = new Date();
        if (aux != null) {
          if (aux.ttl + (new Date(aux.created)).getTime() < dateNow.getTime()) {
            console.log("Session Expired");
            this.localStorage.setObject("Session", null); 
            this.logoutSource.next(true);
          }
          else {
            this.session = new Session();
            console.log("Recuperando la session");
            this.session.id = aux.id;
            this.session.ttl = aux.ttl;
            this.session.created = aux.created;
            this.session.userId = aux.userId;
            this.loginSource.next(this.session);
          }
        } else {
          this.logoutSource.next(true);
          console.log("You need to log in");
        }
        restService.startService(this);
    }

    whenLogin(): Observable<any> {
      return this.loginSource.asObservable();
    }

    whenLogout(): Observable<boolean> {
      return this.logoutSource.asObservable();
    }

    login (email:string, password:string): Promise<Session> {
        return this.http.post(this.restService.getBaseUrl() + '/explorers/login', JSON.stringify ({
            email: email, password: password
            }), {headers: this.restService.createHeaders()})
            .toPromise()
            .then (response => {
                this.localStorage.setObject( "Session", response.json() );
                this.session = response.json();
                this.localStorage.setObject( "Session", this.session );
                this.loginSource.next(this.session);
                return response.json() as Session} )
            .catch (this.loginError)
    }

    private getExplorerError(error: any) : Promise<any> {
        console.log ("Get Explorer ERROR");
        console.error('An error occurred', error); // for demo purposes only
        return Promise.resolve();
    }

    register (email: string, password: string): Promise<Explorer> {
        return this.http.post( this.restService.getBaseUrl() + "/explorers", JSON.stringify ({
          email: email, password: password 
          }), {headers: this.restService.createHeaders()})
          .toPromise()
          .then (response => response.json() as Explorer )
          .catch (this.loginError)
    }

    private loginError (error: any) : Promise<any> {
        console.log ("Login ERROR");
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private logoutError (error: any) : Promise<any> {
        this.session = null;
        return Promise.reject(error.message || error);
    }

    logout (): Promise<boolean> {
        return this.http.post( this.restService.getBaseUrl() + '/explorers/logout', JSON.stringify({}), {headers: this.restService.createHeaders()})
          .toPromise()
          .then (response => {
            console.log(response);
            this.localStorage.setObject("Session", null); 
            this.logoutSource.next(true);
            return true as boolean;
          })
          .catch (this.logoutError)
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Explorer } from '../../explorer/types';
import { ExplorerService } from '../../explorer/explorer.service';
import { RecordService } from '../record.service';
import { RestService } from '../../rest.service';
import { MediaFileService} from '../../media-file/media-file.service';

import { Record } from '../types';
import { MediaFile } from '../../media-file/types';

@Component( {
  selector: 'record-create',
  templateUrl: './record-create.component.html',
  styleUrls: ['record-create.component.less']
})

export class RecordCreateComponent implements OnInit {
  record: Record;
  center: L.LatLng;
  selectedMedia: MediaFile;
  singleMapId = "singleName";

  constructor(private mfService: MediaFileService, private restService: RestService, private rService: RecordService, private router: Router) {
    if (this.restService.session == null) {
      this.router.navigate(['/start']);
    } 
    this.center = L.latLng([-17, -66]);
  }
  ngOnInit() {
    this.rService.getLastNotPublished() 
    .then( r => {
      if (r.media === undefined) {
        r.media = [];
      }
      this.record = r;
      console.log(this.record);
    });
  }

  fillUrl(u:string): string {
    return this.restService.fillUrl(u);
  }

  selectMedia(m: MediaFile) {
    this.selectedMedia = m;
  }

  uploadFiles(ev: any): void {
    console.log (ev);
    this.rService.upload(this.record.id, ev.target.files)
    .then(a => {
      if (this.record.media ===undefined) {
        this.record.media = [];
      }
      this.record.media = this.record.media.concat(a);
    });

    //var files = ev.srcElement.files;
    //this.recordService.uploadFiles(this.record.id, files)
      //.then ( res => { 
        //if (res === undefined) {

        //}
             //console.log(res);
             //this.media = this.media.concat(res);
             //this.addMarkers();
      //});
  }
  changeMapCenter(center) {
    this.center = center;
    console.log("NEw center")
    console.log(center);
  }

  setCurrentLocation(a: MediaFile) {
    console.log("Intentando");
    if (this.center != null) {
      console.log("cambiando a " );
      console.log(this.center);
      a.location = {
        lat: this.center.lat,
        lng: this.center.lng
      }
      this.mfService.patchMediaFile(a)
      .then(mf => {
        console.log(mf);
        let idx = this.record.media.indexOf(a);
        this.record.media[idx] = mf;
      })
    }
  }
  saveRecord() : void {
    this.rService.patchRecord(this.record)
    .then (nr => {
      if (nr.id == this.record.id) {
        console.log("Saving success");
        this.router.navigate(['/home'])
      }
    });
  }

  discardRecord(): void {
    this.rService.deleteRecord(this.record)
    .then (nr => {
      if (nr) {
        this.router.navigate(['/home']);
      } else {
        console.log("Something went wrong");
      }
    })
  }
}

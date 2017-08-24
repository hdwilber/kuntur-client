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
  selector: 'record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.less']
})

export class RecordListComponent implements OnInit {
  records: Record[];
  selectedRecord: Record;
  selectedMedia: MediaFile;
  baseMapId = "rec-";

  constructor(private mfService: MediaFileService, private restService: RestService, private rService: RecordService, private router: Router) {
  }

  ngOnInit() {
    this.rService.getAll(false) 
    .then( r => {
      console.log("Reponse fromserver");
      console.log(r);
      this.records = r;
    });
  }
  edit(r: Record) {
    this.router.navigate(["/record", r.id, 'edit']);
  }
}

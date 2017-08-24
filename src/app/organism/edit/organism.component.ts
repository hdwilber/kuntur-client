import { SimpleChange, Input, Output, Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { Session, Explorer } from "./../../explorer/types"
import { RestService } from "./../../rest.service"
import { ExplorerService } from "../../explorer/explorer.service";
import { RecordService } from "../../record/record.service";
import {OrganismService} from './../organism.service'

import { Organism } from "../types"
import {Taxon} from './../../taxon/types';

@Component({
  selector: 'organism',
  templateUrl: './organism.component.html',
  styleUrls: ['./organism.component.less']

})

export class OrganismComponent implements OnInit {
  org: Organism;
  constructor (private router: Router, private oService: OrganismService, private eService: ExplorerService) {
  }

  ngOnInit():void  {
  }

  ngOnChanges(change: SimpleChange): void {
    console.log(change);
  }
}


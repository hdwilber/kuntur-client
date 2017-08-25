import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { CoolStorageModule, CoolLocalStorage } from "angular2-cool-storage";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { RestService } from "./rest.service";
import { ExplorerService } from "./explorer/explorer.service";
import { MediaFileService } from "./media-file/media-file.service";
import { HeaderComponent } from "./header/header.component";
import { ExplorerStartComponent } from "./explorer/start/explorer-start.component";

import { RecordService } from "./record/record.service";
import { RecordCreateComponent } from './record/create/record-create.component';
import { RecordListComponent } from './record/list/record-list.component';
import { RecordEditComponent } from './record/edit/record-edit.component';

import { MapViewerService } from "./map-viewer/map-viewer.service";
import { MapViewerComponent }  from "./map-viewer/map-viewer.component";
import { HomeComponent } from "./home/home.component";
import { TNodeComponent } from './tnode/tnode.component';

import {OrganismService} from './organism/organism.service'

import {FormsModule, ReactiveFormsModule} from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ExplorerStartComponent,
    RecordCreateComponent,
    MapViewerComponent,
    RecordListComponent,
    RecordEditComponent,
    HomeComponent,
    TNodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    CoolStorageModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,


  ],
  providers: [
    RestService,
    ExplorerService,
    OrganismService,
    RecordService,
    MapViewerService,
    MediaFileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

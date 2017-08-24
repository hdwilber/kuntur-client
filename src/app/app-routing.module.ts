import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule  } from "@angular/forms";

import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from "@angular/http";

// Components
import { AppComponent }  from './app.component';
import { ExplorerStartComponent }  from './explorer/start/explorer-start.component';
import { RecordCreateComponent } from './record/create/record-create.component';
import { HomeComponent } from './home/home.component';
import { RecordListComponent } from './record/list/record-list.component';
import { RecordEditComponent } from './record/edit/record-edit.component';

const routes: Routes = [
    { path: '', redirectTo: '/records', pathMatch: 'full' },
    { path: '', component: AppComponent },
    { path: 'start', component: ExplorerStartComponent },
    { path: 'home', component: RecordListComponent},
    { path: 'create', component: RecordCreateComponent},
    { path: 'records', component: RecordListComponent},
    { path: 'record/:id/edit', component: RecordEditComponent}
];

@NgModule({
    imports: [ 
    RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}

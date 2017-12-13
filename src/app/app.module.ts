import { AppRoutingRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { GridAddItemComponent } from './examples/grid-additem.component';
import { GridBasicComponent } from './examples/grid-basic.component';
import { GridClientSideComponent } from './examples/grid-clientside.component';
import { GridEditorComponent } from './examples/grid-editor.component';
import { GridFormatterComponent } from './examples/grid-formatter.component';
import { GridGraphqlComponent } from './examples/grid-graphql.component';
import { GridHeaderMenuComponent } from './examples/grid-headermenu.component';
import { GridHeaderButtonComponent } from './examples/grid-headerbutton.component';
import { GridMenuComponent } from './examples/grid-menu.component';
import { GridOdataService } from 'angular-slickgrid';
import { GridOdataComponent } from './examples/grid-odata.component';
import { GridRowSelectionComponent } from './examples/grid-rowselection.component';
import { HomeComponent } from './examples/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AngularSlickgridModule } from 'angular-slickgrid';

@NgModule({
  declarations: [
    AppComponent,
    GridAddItemComponent,
    GridBasicComponent,
    GridEditorComponent,
    GridClientSideComponent,
    GridFormatterComponent,
    GridGraphqlComponent,
    GridHeaderButtonComponent,
    GridHeaderMenuComponent,
    GridMenuComponent,
    GridOdataComponent,
    GridRowSelectionComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingRoutingModule,
    BrowserModule,
    HttpClientModule,
    AngularSlickgridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

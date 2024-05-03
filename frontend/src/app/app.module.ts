import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

/*Mines*/
import { FormsModule } from '@angular/forms';
import { HomepageComponent } from './homepage/homepage.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

//Google Maps
import { GoogleMapsModule } from '@angular/google-maps'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SoldiersComponent } from './soldiers/soldiers.component';
import { AddComponent } from './soldiers/add/add.component';
import { NgPipesModule } from 'ngx-pipes';
import { AvailabilityComponent } from './soldiers/availability/availability.component';
import { DateComponent } from './date/date.component';
import { ServicesComponent } from './services/services.component';
import { GiveComponent } from './services/give/give.component';

const socketIoConfig: SocketIoConfig = { url: environment.host, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    /*SmartHlmet*/
    HomepageComponent,
    SoldiersComponent,
    AddComponent,
    AvailabilityComponent,
    DateComponent,
    ServicesComponent,
    GiveComponent,
  ],
  imports: [
    SocketIoModule.forRoot(socketIoConfig),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    GoogleMapsModule,
    NgPipesModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

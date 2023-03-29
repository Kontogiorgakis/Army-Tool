import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ItemShopComponent } from './pages/item-shop/item-shop.component';
import { ItemPreviewComponent } from './pages/item-shop/item-preview/item-preview.component';

/*Mines*/
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ThumbButtonsComponent } from './components/thumb-buttons/thumb-buttons.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { InsideHomeComponent } from './pages/home/inside-home/inside-home.component';
import { MeatsComponent } from './pages/home/meats/meats.component';
import { ChickenSegmentComponent } from './pages/home/meats/chicken/chicken-segment/chicken-segment.component';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/list/add/add.component';
import { ExtrasComponent } from './pages/extras/extras.component';
import { UserSegmentComponent } from './components/user-segment/user-segment.component';
import { RecipeComponent } from './pages/extras/recipe/recipe.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { FridgeComponent } from './pages/home/inside-home/fridge/fridge.component';
import { CupboardComponent } from './pages/home/inside-home/cupboard/cupboard.component';
import { BathroomComponent } from './pages/home/inside-home/bathroom/bathroom.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { SnacksComponent } from './pages/home/inside-home/cupboard/snacks/snacks.component';
import { OralComponent } from './pages/home/inside-home/bathroom/oral/oral.component';
import { FridgePanelComponent } from './places/fridge-panel/fridge-panel.component';
import { FridgeTopbarComponent } from './places/fridge-panel/fridge-topbar/fridge-topbar.component';
import { PendingItemsComponent } from './places/fridge-panel/fridge-topbar/pending-items/pending-items.component';
import { FridgeMeatsComponent } from './places/fridge-panel/fridge-meats/fridge-meats.component';
import { FridgeChickenComponent } from './places/fridge-panel/fridge-meats/fridge-chicken/fridge-chicken.component';
import { FridgeLikeComponent } from './places/fridge-panel/fridge-like/fridge-like.component';
import { FridgeSodaComponent } from './places/fridge-panel/fridge-soda/fridge-soda.component';
import { FridgeFruitsComponent } from './places/fridge-panel/fridge-fruits/fridge-fruits.component';
import { FridgeTropicalComponent } from './places/fridge-panel/fridge-fruits/fridge-tropical/fridge-tropical.component';
import { BathroomPanelComponent } from './places/bathroom-panel/bathroom-panel.component';
import { BathroomTopbarComponent } from './places/bathroom-panel/bathroom-topbar/bathroom-topbar.component';
import { BathroomPendingComponent} from './places/bathroom-panel/bathroom-topbar/bathroom-pending/bathroom-pending.component';
import { BathroomOralComponent } from './places/bathroom-panel/bathroom-oral/bathroom-oral.component';
import { BathroomLikeComponent } from './places/bathroom-panel/bathroom-topbar/bathroom-like/bathroom-like.component';
import { FormsModule } from '@angular/forms';
import { FruitsComponent } from './pages/home/fruits/fruits.component';
import { TropicalComponent } from './pages/home/fruits/tropical/tropical.component';
import { SodaComponent } from './pages/home/inside-home/fridge/soda/soda.component';
import { ReducerComponent } from './reducer/reducer.component';
import { YogurtComponent } from './pages/extras/yogurt/yogurt.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MapComponent } from './map/map.component';

//Google Maps
import { GoogleMapsModule } from '@angular/google-maps'

const socketIoConfig: SocketIoConfig = { url: environment.host, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    ItemShopComponent,
    ItemPreviewComponent,

    /*Shopping List*/
    ThumbButtonsComponent,
    TopBarComponent,
    InsideHomeComponent,
    MeatsComponent,
    ChickenSegmentComponent,
    ListComponent,
    AddComponent,
    ExtrasComponent,
    UserSegmentComponent,
    RecipeComponent,
    NotificationsComponent,
    FridgeComponent,
    CupboardComponent,
    BathroomComponent,
    FavoriteComponent,
    SnacksComponent,
    OralComponent,
    FridgePanelComponent,
    FridgeTopbarComponent,
    PendingItemsComponent,
    FridgeMeatsComponent,
    FridgeChickenComponent,
    FridgeLikeComponent,
    FridgeSodaComponent,
    FridgeFruitsComponent,
    FridgeTropicalComponent,
    BathroomPanelComponent,
    BathroomTopbarComponent,
    BathroomPendingComponent,
    BathroomOralComponent,
    BathroomLikeComponent,
    FruitsComponent,
    TropicalComponent,
    SodaComponent,
    ReducerComponent,
    YogurtComponent,

    /*SmartHlmet*/
    HomepageComponent,
    MapComponent,
  ],
  imports: [
    SocketIoModule.forRoot(socketIoConfig),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

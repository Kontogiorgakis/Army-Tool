import { Component, OnInit} from '@angular/core';
import {
         faBell,
         faUser,
         faChevronLeft,
         faCircle,
        } from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, Router } from '@angular/router';
import {Location} from '@angular/common';
import { filter } from 'rxjs/operators';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductService } from 'src/app/global/services/tasks/products.service';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  //arrow User
  length:number = 0;
  arrow:boolean = false;
  face:boolean = true;

  //togglers
  toggleUser:boolean = false;
  toggleNotifications:boolean=false;
  toggleCounter:boolean = true;

  //ready
  ready:boolean = false;

  //Notifications
  public notificationsAll: NotificationModel[] = []

  constructor(private router: Router, private _location: Location,private productService: ProductService,private notificationService: NotificationsService,private socketService: SocketsService) {
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.notificationShow();
      if(this.router.url==="/"){
        this.arrow=false;
        this.face=true;
      }else{
        this.toggleUser = false;
        this.toggleNotifications=false;
        this.arrow=true;
        this.face=false;
      }
    });
  }

  ngOnInit(): void {
  }

  public notificationShow(){
    this.notificationService.getAll().subscribe((result) => {
      console.log("moves "+result.length)
      //UI
      //console.log(result.length)
      var counter = 0;
      for(var res of result){
        this.notificationsAll.push(res)
        if(res.type==="no"){
          counter++;
        }
      }
      this.length = 16-counter;
      this.ready = true;
      if(this.length==0){
        this.toggleCounter = false;
      }else{
        true;
      }

      //BACKEND
      this.productService.getAll().subscribe((result) => {
        for(var res of result){
          //console.log("COUNTER: "+res.counter+"----MINIMUM: "+res.minimum)
          if(res.name==="Chicken Breasts" || res.name==="Chicken Drums" || res.name==="Chicken Legs" || res.name==="Mango" || res.name==="Avocado"){
            if(res.minimum+0.2<res.counter)
              this.updateNots(res.name)
          }else{
              if(res.minimum<res.counter)
                this.updateNots(res.name)
          }
        }
      });
    });
  }

  private updateNots(name:string){
    for(var nots of this.notificationsAll){
      if(nots.product===name && (nots.type !== "fromFridge" && nots.type !== "fromBathroom")){
        //update to none
        //console.log("NO NOTIFICATION "+nots.product)
        nots.type="no";
        nots.message="";
        //UPDATE
        this.notificationService.update(nots).subscribe((result) => {
          this.socketService.publish("tasks_update", nots);
        });
      }
    }
  }

  public back(){
    if(this.router.url==="/extras" || this.router.url.split('?')[0]==="/home" || this.router.url.split('?')[0]==="/add"){
      this.router.navigateByUrl('/')
    }else if(this.router.url==="/home/meats"){
      this.router.navigateByUrl('/home')
    }else if(this.router.url==="/home/fruits"){
      this.router.navigateByUrl('/home')
    }else{
      this._location.back();
    }
  }

  public goToList(){
    this.router.navigateByUrl('/')
  }

  public user(){
    this.toggleUser=!this.toggleUser;
  }

  public notifications(){
    this.toggleNotifications=!this.toggleNotifications
  }

  title = 'Angular-app';
  faBell = faBell;
  faUser = faUser;
  faChevronLeft = faChevronLeft;
  faCircle = faCircle;
}

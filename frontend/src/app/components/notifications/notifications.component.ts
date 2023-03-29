import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleDown,
  faCirclePlus
 } from '@fortawesome/free-solid-svg-icons';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { ProductService } from 'src/app/global/services/tasks/products.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  nonots:boolean = false;

  //Get notifications
  public pleaseAdd: NotificationModel[] = []
  public runningLow: NotificationModel[] = []
  public fromFridge: NotificationModel[] = []
  public fromBathroom: NotificationModel[] = []

  constructor(private router: Router,private productService: ProductService,private notificationService: NotificationsService,private socketService: SocketsService) {}

  ngOnInit(): void {
    this.getAllNotifications();
  }

  private getAllNotifications(){
    this.nonots=false;
    this.notificationService.getAll().subscribe((result) => {
      console.log(result.length)
      var counter = 0;
      for(var res of result){
        if(res.type==="no"){
          counter++;
        }
      }
      if(counter==16){
        this.emptyList()
      }
      for(var res of result){
        if(res.type==="low"){
          this.runningLow.push(res)
        }else if(res.type==="add"){
          this.pleaseAdd.push(res)
        }else if(res.type==="fromFridge"){
          this.fromFridge.push(res)
        }else if(res.type==="fromBathroom"){
          this.fromBathroom.push(res)
        }
      }
    });
  }

  private emptyList(){
    this.nonots = true;
  }

  public addOnList(add:NotificationModel){
    if(add.type==="fromFridge" || add.type==="fromBathroom"){
      add.type="no";
      add.message="";
      //UPDATE
      this.notificationService.update(add).subscribe((result) => {
        this.socketService.publish("tasks_update", add);
      });

    }
    this.router.navigateByUrl('/add?tab='+add.product)
  }

  faCircleCheck = faCircleCheck;
  faCircleExclamation = faCircleExclamation;
  faCircleDown = faCircleDown;
  faCirclePlus = faCirclePlus;

}

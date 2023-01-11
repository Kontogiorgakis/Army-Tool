import { Component, OnInit } from '@angular/core';
import { faHeart, faXmark, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/global/services/tasks/products.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductModel } from 'src/app/global/models/product/product.model';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';


@Component({
  selector: 'app-bathroom-oral',
  templateUrl: './bathroom-oral.component.html',
  styleUrls: ['./bathroom-oral.component.css']
})
export class BathroomOralComponent implements OnInit {

  done = false;
  public oralProduct: ProductModel[] = []
  notification = new NotificationModel();


  /* Mins*/
  inputs = ["nBrush","nPaste","nDent"];

  //Adds n Lows
  low:{[key: number]: boolean} = {};
  add:{[key: number]: boolean} = {};

  //toggle Color
  color:{[key: number]: boolean} = {};

  constructor(private router: Router,private productService: ProductService,private notificationService: NotificationsService,private socketService: SocketsService) {}

  ngOnInit(): void {
    document.getElementById('topbar')?.setAttribute("style","pointer-events:none")
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.productService.getAll().subscribe((result) => {
      for(var res of result){
        if(res.name==="Toothbrush" || res.name==="Toothpaste" || res.name==="Dental Floss"){
          this.oralProduct.push(res);
        }
      }
      this.done = true;

      /*Adds n Lows*/
      for(var i=0; i<3; i++){
        this.runningLow(i);
        this.pleaseAdd(i);
        this.notificationAdd(i);
      }

      //likes
      this.likedProducts();
      console.log(this.oralProduct)
    });
  }

  public likedProducts(){
    this.productService.getAll().subscribe((result) => {
      var i
      for(var res of this.oralProduct){
        if(res.liked==true){
          if(res.name==="Toothbrush"){
            i=0;
          }else if(res.name==="Toothpaste"){
            i=1;
          }else{
            i=2;
          }
          console.log(res)
          this.color[i]=true;
          //i++;
          //console.log(this.color[i])
        }
      }
    });
  }

  public like(i:number){
    this.color[i]=!this.color[i];



    if(this.color[i]==true){
      this.oralProduct[i].liked =true;
      console.log(this.oralProduct[i])
      //UPDATE
      this.productService.update(this.oralProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.oralProduct[i]);
      })

    }else{
      //Update to false
      this.oralProduct[i].liked=false;
      console.log(this.oralProduct[i])
      this.productService.update(this.oralProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.oralProduct[i]);
      })
    }
  }

  //Delete Task
  public deleteTask(id:string): void {
      this.productService.delete(id).subscribe(() => {
        this.getAllTasks();
        this.socketService.publish("tasks_update", {});
      });
    //}
  }


  public redirect(){
    console.log("blessed")
    this.router.navigateByUrl('/home?tab=bathroom')
    window.location.reload();
  }

  public counter(){
    console.log("NTOOUT")
  }

  public addItem(num: number){
    this.router.navigateByUrl('/add?tab='+this.oralProduct[num].name)
  }

  /*Adders and Minusers*/
  public addOral(i:number){
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    let number = parseInt(input.innerHTML);
    console.log(number)
    if(number+1<=10)
        number = number + 1;
    this.oralProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.oralProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.oralProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i);

  }

  public minOral(i:number){
    console.log("MIN")
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    let number = parseInt(input.innerHTML);
    console.log(number)
    if(number-1>=0)
        number = number - 1;
    this.oralProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.oralProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.oralProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i);
  }


  public runningLow(i:number){
    console.log(this.oralProduct[i].minimum+"  VS  "+this.oralProduct[i].counter)
    if(this.oralProduct[i].minimum===this.oralProduct[i].counter && this.oralProduct[i].counter!==0){
      this.low[i]=true;
      return true;
    }else{
      this.low[i]=false;
      return false;
    }
  }

  public pleaseAdd(i:number){
    if(this.oralProduct[i].minimum>this.oralProduct[i].counter){
      this.add[i]=true;
      return true;
    }else{
      this.add[i]=false;
      return false;
    }
  }

  public back(){
    document.getElementById('topbar')?.setAttribute("style","pointer-events:auto")
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  public notificationAdd(i:number){
    this.notificationService.getAll().subscribe((result) => {
      var oral=0;

      for(var res of result){
        if(res.product==="Toothbrush" || res.product==="Toothpaste" || res.product==="Dental Floss")
          oral=1;
      }
      if(oral==0){
        console.log("HELLO "+this.oralProduct[i].name)
        //CREATE NOTIFICATIONS
        this.notification.product=this.oralProduct[i].name;
        this.notification.completed= false;
        this.notification.type = "no";
        this.notification.message="";
        this.notificationService.create(this.notification).subscribe((result) => {
          this.socketService.publish("tasks_update", this.notification);
        })
      }else{
        for(var res of result){
          if(res.product===this.oralProduct[i].name)
            this.notification = res
        }
        if(this.pleaseAdd(i)){
          console.log("PLEASE ADD "+this.oralProduct[i].name)
          this.notification.type="add";
          this.notification.message="Please add "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });
        }
        if(this.runningLow(i)){
          console.log("RUNNING LOW "+this.oralProduct[i].name)
          this.notification.type="low";
          this.notification.message="Running low "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });

        }
        if(!this.pleaseAdd(i) && !this.runningLow(i)){
          console.log("NO NOTIFICATION "+this.oralProduct[i].name)
          this.notification.type="no";
          this.notification.message="";
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });
        }
      }
    });
  }

  public addFromBathroom(i:number){
    this.notificationService.getAll().subscribe((result) => {
      var oral=0;

      for(var res of result){
        if(res.product==="Toothbrush" || res.product==="Toothpaste" || res.product==="Dental Floss")
          oral=1;
      }
      if(oral==0){
        console.log("HELLO "+this.oralProduct[i].name)
        //CREATE NOTIFICATIONS
        this.notification.product=this.oralProduct[i].name;
        this.notification.completed= false;
        this.notification.type = "no";
        this.notification.message="";
        this.notificationService.create(this.notification).subscribe((result) => {
          this.socketService.publish("tasks_update", this.notification);
        })
      }else{
        if(!this.pleaseAdd(i) && !this.runningLow(i)){
          console.log("ADD FROM BATHROOM "+this.oralProduct[i].name)
          this.notification.type="fromBathroom";
          this.notification.message="Add from Bathroom ";
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });
        }
      }
      alert("Complete addition from phone!")
    });
  }

  faHeart = faHeart;
  faXmark = faXmark;
  faChevronRight = faChevronRight;
}

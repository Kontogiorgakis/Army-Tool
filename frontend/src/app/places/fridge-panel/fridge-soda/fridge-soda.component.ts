import { Component, OnInit } from '@angular/core';
import { faHeart, faXmark, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/global/services/tasks/products.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductModel } from 'src/app/global/models/product/product.model';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';

@Component({
  selector: 'app-fridge-soda',
  templateUrl: './fridge-soda.component.html',
  styleUrls: ['./fridge-soda.component.css']
})
export class FridgeSodaComponent implements OnInit {

  done = false;
  public sodaProduct: ProductModel[] = []
  notification = new NotificationModel();

  /* Mins*/
  inputs = ["nCoca","nRed","nGat"];

  //Adds n Lows
  low:{[key: number]: boolean} = {};
  add:{[key: number]: boolean} = {};

  //toggle Color
  color:{[key: number]: boolean} = {};


  //Chicken
  constructor(private router: Router,private productService: ProductService,private notificationService: NotificationsService,private socketService: SocketsService) {}

  ngOnInit(): void {
    this.getAllTasks();
    document.getElementById('topbar')?.setAttribute("style","pointer-events:none")
  }


  private getAllTasks(): void {
    this.productService.getAll().subscribe((result) => {
      for(var res of result){
        if(res.name==="Coca Cola" || res.name==="Red Bull" || res.name==="Gatorade"){
          this.sodaProduct.push(res);
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
      console.log(this.sodaProduct)
    });
  }

  public likedProducts(){
    this.productService.getAll().subscribe((result) => {
      var i
      for(var res of this.sodaProduct){
        if(res.liked==true){
          if(res.name==="Coca Cola"){
            i=0;
          }else if(res.name==="Red Bull"){
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
      this.sodaProduct[i].liked =true;
      console.log(this.sodaProduct[i])
      //UPDATE
      this.productService.update(this.sodaProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.sodaProduct[i]);
      })

    }else{
      //Update to false
      this.sodaProduct[i].liked=false;
      console.log(this.sodaProduct[i])
      this.productService.update(this.sodaProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.sodaProduct[i]);
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

  public counter(){
    console.log("NTOOUT")
  }

  public addItem(){
    //var val = document.getElementById('numero') as HTMLInputElement
    //console.log(val.value)
    //this.sodaProduct[1].minimum = parseInt(val.value);
    //UPDATE
    /*this.productService.update(this.sodaProduct[1]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.sodaProduct[1]);
    });*/
  }

  /*Adders and Minusers*/
  public addLiquid(i:number){
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    let number = parseInt(input.innerHTML);
    console.log(number)
    if(number+1<=10)
        number = number + 1;
    this.sodaProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.sodaProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.sodaProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i);

  }

  public minLiquid(i:number){
    console.log("MIN")
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    let number = parseInt(input.innerHTML);
    console.log(number)
    if(number-1>=0)
        number = number - 1;
    this.sodaProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.sodaProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.sodaProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i);
  }

  public runningLow(i:number){
    console.log(this.sodaProduct[i].minimum+"  VS  "+this.sodaProduct[i].counter)
    if(this.sodaProduct[i].minimum===this.sodaProduct[i].counter){
      this.low[i]=true;
      return true;
    }else{
      this.low[i]=false;
      return false;
    }
  }

  public pleaseAdd(i:number){
    if(this.sodaProduct[i].minimum>this.sodaProduct[i].counter && this.sodaProduct[i].counter!==0){
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
      var soda=0;

      for(var res of result){
        if(res.product==="Coca Cola" || res.product==="Red Bull" || res.product==="Gatorade")
          soda=1;
      }
      if(soda==0){
        console.log("HELLO "+this.sodaProduct[i].name)
        //CREATE NOTIFICATIONS
        this.notification.product=this.sodaProduct[i].name;
        this.notification.completed= false;
        this.notification.type = "no";
        this.notification.message="";
        this.notificationService.create(this.notification).subscribe((result) => {
          this.socketService.publish("tasks_update", this.notification);
        })
      }else{
        for(var res of result){
          if(res.product===this.sodaProduct[i].name)
            this.notification = res
        }
        if(this.pleaseAdd(i)){
          console.log("PLEASE ADD "+this.sodaProduct[i].name)
          this.notification.type="add";
          this.notification.message="Please add "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });
        }
        if(this.runningLow(i)){
          console.log("RUNNING LOW "+this.sodaProduct[i].name)
          this.notification.type="low";
          this.notification.message="Running low "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });

        }
        if(!this.pleaseAdd(i) && !this.runningLow(i)){
          console.log("NO NOTIFICATION "+this.sodaProduct[i].name)
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

  public addFromFridge(i:number){
    this.notificationService.getAll().subscribe((result) => {
      var soda=0;

      for(var res of result){
        if(res.product==="Coca Cola" || res.product==="Red Bull" || res.product==="Gatorade")
          soda=1;
      }
      if(soda==0){
        console.log("HELLO "+this.sodaProduct[i].name)
        //CREATE NOTIFICATIONS
        this.notification.product=this.sodaProduct[i].name;
        this.notification.completed= false;
        this.notification.type = "no";
        this.notification.message="";
        this.notificationService.create(this.notification).subscribe((result) => {
          this.socketService.publish("tasks_update", this.notification);
        })
      }else{
        if(!this.pleaseAdd(i) && !this.runningLow(i)){
          console.log("ADD FROM FRIDGE "+this.sodaProduct[i].name)
          this.notification.type="fromFridge";
          this.notification.message="Add from Fridge ";
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

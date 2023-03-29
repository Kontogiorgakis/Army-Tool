import { Component, OnInit } from '@angular/core';
import { faHeart, faXmark} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/global/services/tasks/products.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductModel } from 'src/app/global/models/product/product.model';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';

@Component({
  selector: 'app-snacks',
  templateUrl: './snacks.component.html',
  styleUrls: ['./snacks.component.css']
})

export class SnacksComponent implements OnInit {

  done = false;
  public snacksProduct: ProductModel[] = []
  notification = new NotificationModel();

  /* Mins*/
  inputs = ["nPop","nChip","nBisc"];

  //Adds n Lows
  low:{[key: number]: boolean} = {};
  add:{[key: number]: boolean} = {};

  //toggle Color
  color:{[key: number]: boolean} = {};


  //Chicken
  constructor(private router: Router,private productService: ProductService,private notificationService: NotificationsService,private socketService: SocketsService) {}
  ngOnInit(): void {
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.productService.getAll().subscribe((result) => {
      for(var res of result){
        if(res.name==="Chips" || res.name==="Pop Corn" || res.name==="Biscuits"){
          this.snacksProduct.push(res);
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
      console.log(this.snacksProduct)
    });
  }

  public likedProducts(){
    this.productService.getAll().subscribe((result) => {
      var i
      for(var res of this.snacksProduct){
        if(res.liked==true){
          if(res.name==="Pop Corn"){
            i=0;
          }else if(res.name==="Chips"){
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
      this.snacksProduct[i].liked =true;
      console.log(this.snacksProduct[i])
      //UPDATE
      this.productService.update(this.snacksProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.snacksProduct[i]);
      })

    }else{
      //Update to false
      this.snacksProduct[i].liked=false;
      console.log(this.snacksProduct[i])
      this.productService.update(this.snacksProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.snacksProduct[i]);
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
    this.router.navigateByUrl('/home?tab=cupboard')
    window.location.reload();
  }

  public counter(){
    console.log("NTOOUT")
  }

  public addItem(num: number){
    this.router.navigateByUrl('/add?tab='+this.snacksProduct[num].name)
  }

  /*Adders and Minusers*/
  public addSnacks(i:number){
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    let number = parseInt(input.innerHTML);
    console.log(number)
    if(number+1<=10)
        number = number + 1;
    this.snacksProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.snacksProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.snacksProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i);
  }

  public minSnacks(i:number){
    console.log("MIN")
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    let number = parseInt(input.innerHTML);
    console.log(number)
    if(number-1>=0)
        number = number - 1;
    this.snacksProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.snacksProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.snacksProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i);
  }

  public runningLow(i:number){
    console.log(this.snacksProduct[i].minimum+"  VS  "+this.snacksProduct[i].counter)
    if(this.snacksProduct[i].minimum===this.snacksProduct[i].counter && this.snacksProduct[i].counter!==0){
      this.low[i]=true;
      return true;
    }else{
      this.low[i]=false;
      return false;
    }
  }

  public pleaseAdd(i:number){
    if(this.snacksProduct[i].minimum>this.snacksProduct[i].counter && this.snacksProduct[i].counter!==0){
      this.add[i]=true;
      return true;
    }else{
      this.add[i]=false;
      return false;
    }
  }

  public notificationAdd(i:number){
    this.notificationService.getAll().subscribe((result) => {
      var snack=0;

      for(var res of result){
        if(res.product==="Chips" || res.product==="Pop Corn" || res.product==="Biscuits")
          snack=1;
      }
      if(snack==0){
        console.log("HELLO "+this.snacksProduct[i].name)
        //CREATE NOTIFICATIONS
        this.notification.product=this.snacksProduct[i].name;
        this.notification.completed= false;
        this.notification.type = "no";
        this.notification.message="";
        this.notificationService.create(this.notification).subscribe((result) => {
          this.socketService.publish("tasks_update", this.notification);
        })
      }else{
        for(var res of result){
          if(res.product===this.snacksProduct[i].name)
            this.notification = res
        }
        if(this.pleaseAdd(i)){
          console.log("PLEASE ADD "+this.snacksProduct[i].name)
          this.notification.type="add";
          this.notification.message="Please add "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });
        }
        if(this.runningLow(i)){
          console.log("RUNNING LOW "+this.snacksProduct[i].name)
          this.notification.type="low";
          this.notification.message="Running low "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });

        }
        if(!this.pleaseAdd(i) && !this.runningLow(i)){
          console.log("NO NOTIFICATION "+this.snacksProduct[i].name)
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

  faHeart = faHeart;
  faXmark = faXmark
}

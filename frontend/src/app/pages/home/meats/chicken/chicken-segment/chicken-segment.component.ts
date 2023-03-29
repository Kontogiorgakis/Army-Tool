import { Component, OnInit } from '@angular/core';
import { faHeart, faXmark} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/global/services/tasks/products.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductModel } from 'src/app/global/models/product/product.model';

import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';
import { IfStmt } from '@angular/compiler';


@Component({
  selector: 'app-chicken-segment',
  templateUrl: './chicken-segment.component.html',
  styleUrls: ['./chicken-segment.component.css']
})
export class ChickenSegmentComponent implements OnInit {

  done = false;
  public chickenProduct: ProductModel[] = []
  notification = new NotificationModel();

  /* Mins*/
  inputs = ["nWho","nDrum","nBre","nLeg"];

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
        if(res.name==="Chicken Whole" || res.name==="Chicken Breasts" || res.name==="Chicken Drums" || res.name==="Chicken Legs"){
          this.chickenProduct.push(res);
        }
      }

      this.done = true;

      /*Adds n Lows*/
      for(var i=0; i<4; i++){
        this.runningLow(i);
        this.pleaseAdd(i);
        this.notificationAdd(i);
      }

      //likes
      this.likedProducts();
      //console.log(this.chickenProduct)

    });
  }

  public likedProducts(){
    this.productService.getAll().subscribe((result) => {
      var i
      for(var res of this.chickenProduct){
        if(res.liked==true){
          if(res.name==="Chicken Whole"){
            i=0;
          }else if(res.name==="Chicken Drums"){
            i=1;
          }else if(res.name==="Chicken Breasts"){
            i=2;
          }else{
            i=3;
          }
          //console.log(res)
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
      this.chickenProduct[i].liked =true;
      console.log(this.chickenProduct[i])
      //UPDATE
      this.productService.update(this.chickenProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.chickenProduct[i]);
      })

    }else{
      //Update to false
      this.chickenProduct[i].liked=false;
      console.log(this.chickenProduct[i])
      this.productService.update(this.chickenProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.chickenProduct[i]);
      })
    }
  }

  //Delete Task
  public deleteTask(id:string): void {
    //const response = confirm("Are you sure you want to delete this task?");
    //if (response) {
      this.productService.delete(id).subscribe(() => {
        this.getAllTasks();
        this.socketService.publish("tasks_update", {});
      });
    //}
  }

  public counter(){
    console.log("NTOOUT")
  }

  public addItem(num: number){
    this.router.navigateByUrl('/add?tab='+this.chickenProduct[num].name)
  }

  public redirect(){
    this.router.navigateByUrl('/home/meats')
  }

  /*Adders and Minusers*/
  public addMeat(i:number){
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    console.log(input.innerHTML)
    let number
    if(i===0){
      number = parseInt(input.innerHTML);
      if(number+1<=10)
        number = number + 1;
    }else{
      number = parseFloat(input.innerHTML);
      if(number+0.2<=5)
        number = number + 0.2;
      number = parseFloat(number.toFixed(2))
    }
    this.chickenProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.chickenProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.chickenProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i);

  }

  public minMeat(i:number){
    console.log("MIN")
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    console.log(input.innerHTML)
    let number
    if(i===0){
      number = parseInt(input.innerHTML);
      if(number-1>=0)
        number = number - 1;
    }else{
      number = parseFloat(input.innerHTML);
      if(number-0.2>=0)
        number = number - 0.2;
      number = parseFloat(number.toFixed(2))
    }
    this.chickenProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.chickenProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.chickenProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i);
  }


  public runningLow(i:number){
    if(i===0){
      //console.log(this.chickenProduct[i].minimum+"  VS  "+this.chickenProduct[i].counter)
      if(this.chickenProduct[i].minimum===this.chickenProduct[i].counter && this.chickenProduct[i].counter!==0){
        //this.notificationAdd(this.chickenProduct[i].name,"low","Running low: ")
        this.low[i]=true;
        return true;
      }else{
        this.low[i]=false;
        return false;
      }
    }else{
      //console.log(this.chickenProduct[i].minimum+"  VS  "+this.chickenProduct[i].counter)
      if(this.chickenProduct[i].minimum===this.chickenProduct[i].counter && this.chickenProduct[i].counter!==0){
        this.low[i]=true;
        return true;
        //this.notificationAdd(this.chickenProduct[i].name,"low","Running low: ")
      }else if(this.chickenProduct[i].minimum+0.2>=this.chickenProduct[i].counter && this.chickenProduct[i].minimum<this.chickenProduct[i].counter && this.chickenProduct[i].counter!==0){
        //this.notificationAdd(this.chickenProduct[i].name,"low","Running low: ")
        this.low[i]=true;
        return true;
      }else{
        this.low[i]=false;
        return false;
      }
    }
  }

  public pleaseAdd(i:number){
    if(this.chickenProduct[i].minimum>this.chickenProduct[i].counter){
      //this.notificationAdd(this.chickenProduct[i].name,"add","Please add: ")
      this.add[i]=true;
      return true;
    }else{
      this.add[i]=false;
      return false;
    }
  }


  public notificationAdd(i:number){
    this.notificationService.getAll().subscribe((result) => {
      var chicken=0;

      for(var res of result){
        if(res.product==="Chicken Whole" || res.product==="Chicken Breasts" || res.product==="Chicken Drums" || res.product==="Chicken Legs")
          chicken=1;
      }
      if(chicken==0){
        console.log("HELLO "+this.chickenProduct[i].name)
        //CREATE NOTIFICATIONS
        this.notification.product=this.chickenProduct[i].name;
        this.notification.completed= false;
        this.notification.type = "no";
        this.notification.message="";
        this.notificationService.create(this.notification).subscribe((result) => {
          this.socketService.publish("tasks_update", this.notification);
        })
      }else{
        for(var res of result){
          if(res.product===this.chickenProduct[i].name)
            this.notification = res
        }
        if(this.pleaseAdd(i)){
          console.log("PLEASE ADD "+this.chickenProduct[i].name)
          this.notification.type="add";
          this.notification.message="Please add "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });
        }
        if(this.runningLow(i)){
          console.log("RUNNING LOW "+this.chickenProduct[i].name)
          this.notification.type="low";
          this.notification.message="Running low "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });

        }
        if(!this.pleaseAdd(i) && !this.runningLow(i)){
          console.log("NO NOTIFICATION "+this.chickenProduct[i].name)
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

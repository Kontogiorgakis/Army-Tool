import { Component, OnInit } from '@angular/core';
import { faHeart, faXmark} from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, Router } from '@angular/router';

import { ProductService } from 'src/app/global/services/tasks/products.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductModel } from 'src/app/global/models/product/product.model';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tropical',
  templateUrl: './tropical.component.html',
  styleUrls: ['./tropical.component.css']
})
export class TropicalComponent implements OnInit {

  done = false;
  public tropicalProduct: ProductModel[] = []
    notification = new NotificationModel();


  /* Mins*/
  inputs = ["nMan","nAvo","nPin"];

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
        if(res.name==="Pineapple" || res.name==="Mango" || res.name==="Avocado"){
          if(res.name==="Pineapple"){
            this.tropicalProduct[2] = res
          }else if(res.name==="Mango"){
            this.tropicalProduct[1] = res
          }else{
            this.tropicalProduct[0] = res
          }
          //this.tropicalProduct.push(res);
          //console.log(res.counter)
        }
      }
      this.done = true;

      /*Adds n Lows*/
      for(var i=0; i<3; i++){
        this.runningLow(i);
        this.pleaseAdd(i);
        this.notificationAdd(i)
      }

      //likes
      this.likedProducts();
      console.log(this.tropicalProduct)
    });
  }

  public likedProducts(){
    this.productService.getAll().subscribe((result) => {
      var i
      for(var res of this.tropicalProduct){
        if(res.liked==true){
          if(res.name==="Mango"){
            i=0;
          }else if(res.name==="Avocado"){
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
      this.tropicalProduct[i].liked =true;
      console.log(this.tropicalProduct[i])
      //UPDATE
      this.productService.update(this.tropicalProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.tropicalProduct[i]);
      })

    }else{
      //Update to false
      this.tropicalProduct[i].liked=false;
      console.log(this.tropicalProduct[i])
      this.productService.update(this.tropicalProduct[i]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.tropicalProduct[i]);
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

  public addItem(num: number){
    this.router.navigateByUrl('/add?tab='+this.tropicalProduct[num].name)
  }

  public redirect(){
    this.router.navigateByUrl('/home/fruits')
  }


  /*Adders and Minusers*/
  public addFruit(i:number){
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    //console.log(number)
    let number
    if(i===2){
      number = parseInt(input.innerHTML);
      if(number+1<=10)
        number = number + 1;
    }else{
      number = parseFloat(input.innerHTML);
      if(number+0.2<=5)
        number = number + 0.2;
      number = parseFloat(number.toFixed(2))
    }
    this.tropicalProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.tropicalProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.tropicalProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i)
  }

  public minFruit(i:number){
    console.log("MIN")
    let input = document.getElementById(this.inputs[i]) as HTMLInputElement
    //console.log(number)
    let number
    if(i===2){
      number = parseInt(input.innerHTML);
      if(number-1>=0)
        number = number - 1;
    }else{
      number = parseFloat(input.innerHTML);
      if(number-0.2>=0)
        number = number - 0.2;
      number = parseFloat(number.toFixed(2))
    }
    this.tropicalProduct[i].minimum =number;
    //UPDATE
    this.productService.update(this.tropicalProduct[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.tropicalProduct[i]);
    })
    input.innerHTML = number.toString();
    this.runningLow(i);
    this.pleaseAdd(i);
    this.notificationAdd(i)
  }

  public runningLow(i:number){
    if(i===2){
      console.log(this.tropicalProduct[i].minimum+"  VS  "+this.tropicalProduct[i].counter)
      if(this.tropicalProduct[i].minimum===this.tropicalProduct[i].counter && this.tropicalProduct[i].counter!==0){
        this.low[i]=true;
        return true;
      }else{
        this.low[i]=false;
        return false;
      }
    }else{
      console.log(this.tropicalProduct[i].minimum+"  VS  "+this.tropicalProduct[i].counter)
      if(this.tropicalProduct[i].minimum===this.tropicalProduct[i].counter && this.tropicalProduct[i].counter!==0){
        this.low[i]=true;
        return true;
      }else if(this.tropicalProduct[i].minimum+0.2>=this.tropicalProduct[i].counter && this.tropicalProduct[i].minimum<this.tropicalProduct[i].counter && this.tropicalProduct[i].counter!==0){
        this.low[i]=true;
        return true;
      }else{
        this.low[i]=false;
        return false;
      }
    }
  }

  public pleaseAdd(i:number){
    if(this.tropicalProduct[i].minimum>this.tropicalProduct[i].counter){
      this.add[i]=true;
      return true;
    }else{
      this.add[i]=false;
      return false;
    }
  }

  public notificationAdd(i:number){
    var tropical=0;

    this.notificationService.getAll().subscribe((result) => {
      for(var res of result){
        if(res.product==="Pineapple" || res.product==="Mango" || res.product==="Avocado")
          tropical=1;
      }
      if(tropical==0){
        console.log("HELLO "+this.tropicalProduct[i].name)
        //CREATE NOTIFICATIONS
        this.notification.product=this.tropicalProduct[i].name;
        this.notification.completed= false;
        this.notification.type = "no";
        this.notification.message="";
        this.notificationService.create(this.notification).subscribe((result) => {
          this.socketService.publish("tasks_update", this.notification);
        })
      }else{
        for(var res of result){
          if(res.product===this.tropicalProduct[i].name)
            this.notification = res
        }
        if(this.pleaseAdd(i)){
          console.log("PLEASE ADD "+this.tropicalProduct[i].name)
          this.notification.type="add";
          this.notification.message="Please add "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });
        }
        if(this.runningLow(i)){
          console.log("RUNNING LOW "+this.tropicalProduct[i].name)
          this.notification.type="low";
          this.notification.message="Running low "
          //UPDATE
          this.notificationService.update(this.notification).subscribe((result) => {
            this.socketService.publish("tasks_update", this.notification);
          });

        }
        if(!this.pleaseAdd(i) && !this.runningLow(i)){
          console.log("NO NOTIFICATION "+this.tropicalProduct[i].name)
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

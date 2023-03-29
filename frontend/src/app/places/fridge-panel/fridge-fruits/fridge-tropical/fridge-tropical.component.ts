import { Component, OnInit } from '@angular/core';
import { faHeart, faXmark, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/global/services/tasks/products.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductModel } from 'src/app/global/models/product/product.model';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';

@Component({
  selector: 'app-fridge-tropical',
  templateUrl: './fridge-tropical.component.html',
  styleUrls: ['./fridge-tropical.component.css']
})
export class FridgeTropicalComponent implements OnInit {

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

  constructor(private router: Router,private productService: ProductService,private notificationService: NotificationsService,private socketService: SocketsService) {}

  ngOnInit(): void {
    document.getElementById('topbar')?.setAttribute("style","pointer-events:none")
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.productService.getAll().subscribe((result) => {
      for(var res of result){
        if(res.name==="Pineapple" || res.name==="Mango" || res.name==="Avocado"){
          this.tropicalProduct.push(res);
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
    //this.router.navigateByUrl('/add?tab='+this.items[num]+'')
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
    this.notificationAdd(i);

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
    this.notificationAdd(i);

  }


  public back(){
    document.getElementById('topbar')?.setAttribute("style","pointer-events:auto")
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
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
      if(this.tropicalProduct[i].minimum===this.tropicalProduct[i].counter){
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
    this.notificationService.getAll().subscribe((result) => {
      var fruit=0;

      for(var res of result){
        if(res.product==="Pineapple" || res.product==="Mango" || res.product==="Avocado")
          fruit=1;
      }
      if(fruit==0){
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

  public addFromFridge(i:number){
    this.notificationService.getAll().subscribe((result) => {
      var fruit=0;

      for(var res of result){
        if(res.product==="Pineapple" || res.product==="Mango" || res.product==="Avocado")
          fruit=1;
      }
      if(fruit==0){
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
        if(!this.pleaseAdd(i) && !this.runningLow(i)){
          console.log("ADD FROM FRIDGE "+this.tropicalProduct[i].name)
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

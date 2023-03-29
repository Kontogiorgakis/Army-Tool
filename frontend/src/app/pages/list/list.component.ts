import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faP,faCheck, faChevronDown, faChevronUp,faPlus, faCircle, faTrashCan, faHeart} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { TaskModel } from 'src/app/global/models/tasks/task.model';
import { TasksService } from 'src/app/global/services/tasks/tasks.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductService } from 'src/app/global/services/tasks/products.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  items:number = 0;
  public months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  public dates: string[] = [];

  //status
  buy:{[key: number]: boolean} = {};
  checked:{[key: number]: boolean} = {};

  //chevrons for informations
  up:{[key: number]: boolean} = {};
  down:{[key: number]: boolean} = {};


  //informations
  infos:{[key: number]: boolean} = {};

  //toggle Color
  color:{[key: number]: boolean} = {};

  //filters
  all:boolean = true;
  bought:boolean = false;
  stored:boolean = false;
  not:boolean = false;

  /*All items*/
  public products: TaskModel[] = [];
  /*Purchased Items*/
  public purchased: TaskModel[] = [];


  constructor(private router: Router,private tasksService: TasksService,private productService: ProductService, private socketService: SocketsService) {}


  ngOnInit(): void {
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.tasksService.getAll().subscribe((result) => {
      for(let res of result){
        this.products.push(res);
      }
      //this.products = result;
      console.log(this.products)
      this.items = this.products.length

      /*remake status and like*/
      for(let i=0; i<this.products.length; i++){

        //Convert day
        var date = new Date(this.products[i].createdAt)
        this.dates[i] = this.months[date.getMonth()]+". "+date.getDate()+", "+date.getHours()+":"+date.getMinutes();

        this.initStatus(i);
        this.likedProducts(i);
      }

      /*remake empty*/
      if(this.items==0){
        this.emptyList();
      }

      console.log(this.items)
    });
  }

  public emptyList(){
    const div = document.getElementById('listing');
    if(this.bought){
      div!.innerHTML = '<div style="text-align:center; color: #8C8C8C; text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1); font-size: 18px; font-weight:600; margin-top:30px; ">No Purchased Products!</div>';
    }else if(this.stored){
      div!.innerHTML = '<div style="text-align:center; color: #8C8C8C; text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1); font-size: 18px; font-weight:600; margin-top:30px; ">No Stored Products!</div>';
    }else if(this.not){
      div!.innerHTML = '<div style="text-align:center; color: #8C8C8C; text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1); font-size: 18px; font-weight:600; margin-top:30px; ">No Products for Purchase!</div>';
    }else{
      div!.innerHTML = '<div style="text-align:center; color: #8C8C8C; text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1); font-size: 18px; font-weight:600; margin-top:30px; ">The List is Empty!</div>';
    }
  }

  public likedProducts(i:number){
    this.productService.getAll().subscribe((result) => {
      for(var res of result){
        if(res.name===this.products[i].name && res.liked){
          this.color[i]=true;
          console.log(this.color[i])
        }
      }
    });
  }

  public status(index:number){
    if(this.buy[index]){
      this.products[index].type="Stored";
      //UPDATE
      this.tasksService.update(this.products[index]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.products[index]);
      });
      //Change Counter
      console.log(this.products[index].name)
      this.productService.getAll().subscribe((result) => {
        for(var res of result){
          if(res.name===this.products[index].name){
            res.counter = res.counter+parseFloat(this.products[index].quantity)
            //UPDATE
            this.productService.update(res).subscribe((result) => {
              this.socketService.publish("tasks_update", res);
            });
          }
        }
        this.checked[index]=true;
        this.buy[index]=false;
        //window.location.reload();
      });
    }
    if(!this.buy[index] && !this.checked[index]){
      this.products[index].type="Purchased";
      //UPDATE
      this.tasksService.update(this.products[index]).subscribe((result) => {
        this.socketService.publish("tasks_update", this.products[index]);
      });
      this.buy[index]=true
    }
  }

  public initStatus(index:number){
    if(this.products[index].type==="Stored"){
      this.checked[index]=true;
      this.buy[index]=false;
    }
    if(this.products[index].type==="Purchased"){
      this.buy[index]=true
      this.checked[index]=false;
    }
    if(this.products[index].type==="Not Purchased"){
      this.buy[index]=false;
      this.checked[index]=false;
    }
  }

  //Status
  public getStatus(index:number,description:boolean):string{
    if(this.checked[index]){
      return "Placed inside "+this.products[index].status
    }
    if(this.buy[index]){
      if(description){
        return "Purchased"
      }else{
        return "Purchased. Place it in the "+this.products[index].status
      }
    }
    if(!this.buy[index] && !this.checked[index]){
      return "Not Purchased Yet";
    }
    return "Lakaka"
  }

  //Delete Task
  public deleteTask(task: TaskModel): void {
    const response = confirm("Are you sure you want to delete this task?");
    if (response) {
      this.tasksService.delete(task._id).subscribe(() => {
        //this.getAllTasks();
        this.socketService.publish("tasks_update", {});
        window.location.reload();
      });
    }
  }


  public toggle(index:number){
    this.infos[index] = !this.infos[index];
    this.down[index] = !this.down[index];
    this.up[index] = !this.up[index];
  }

  public selected(type: string){
    if(type==="all"){
      //all
      //this.getAllTasks();
      this.changeItems("All")
      this.all=true;
      this.bought=false;
      this.stored=false;
      this.not=false;
    }else if(type==="bought"){
      this.changeItems("Purchased")
      this.all=false;
      this.bought=true;
      this.stored=false;
      this.not=false;
    }else if(type==="stored"){
      this.changeItems("Stored")
      this.all=false;
      this.bought=false;
      this.stored=true;
      this.not=false;
    }else if(type==="not"){
      this.changeItems("Not Purchased")
      this.all=false;
      this.bought=false;
      this.stored=false;
      this.not=true;
    }

  }

  public changeItems(type:string){
    for(let i=0; i<this.products.length; i++){
      this.products.splice(i);
    }
    if(type==="All"){
      this.tasksService.getAll().subscribe((result) => {
        for(const element of result){
          this.products.push(element);
        }
        /*remake status*/
        for(let i=0; i<this.products.length; i++){
          this.initStatus(i);
        }
        if(this.products.length===0){
          this.emptyList();
        }
        console.log(this.products.length);
        this.items = this.products.length
      });
    }else{
      this.tasksService.getAll().subscribe((result) => {
        this.purchased = result
        for(const element of this.purchased){
          if(element.type===type){
            this.products.push(element);
          }
        }
        /*remake status*/
        for(let i=0; i<this.products.length; i++){
          this.initStatus(i);
        }
        console.log(this.products.length);
        this.items = this.products.length
        /*if(this.products.length===0){
          this.emptyList();
        }*/
      });
    }
      //console.log("ITEMS "+this.items)
      //this.items = this.products.length
      //console.log(this.products)
  }

  public like(i:number){
    this.color[i]=!this.color[i];

    if(this.color[i]==true){
      //Update to liked
      this.productService.getAll().subscribe((result) => {
        for(var res of result){
          if(res.name===this.products[i].name){
            res.liked=true;
            this.productService.update(res).subscribe((result) => {
              this.socketService.publish("tasks_update", res);
            })
          }
        }
      });
    }else{
      //Update to false
      this.productService.getAll().subscribe((result) => {
        for(var res of result){
          if(res.name===this.products[i].name){
            res.liked=false;
            this.productService.update(res).subscribe((result) => {
              this.socketService.publish("tasks_update", res);
            })
          }
        }
      });
    }
  }

  public addItem(){
    this.router.navigateByUrl('/add')
  }

  faP = faP;
  faCheck = faCheck;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faCircle = faCircle;
  faTrashCan = faTrashCan;
  faHeart = faHeart;
  faChevronUp = faChevronUp;
}

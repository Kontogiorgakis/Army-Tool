import { Component, OnInit } from '@angular/core';
import {faCalendarDays,faListOl,faCheck} from '@fortawesome/free-solid-svg-icons';

import { TasksService } from 'src/app/global/services/tasks/tasks.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { TaskModel } from 'src/app/global/models/tasks/task.model';
import { ProductService } from 'src/app/global/services/tasks/products.service';
import { ProductModel } from 'src/app/global/models/product/product.model';


@Component({
  selector: 'app-bathroom-pending',
  templateUrl: './bathroom-pending.component.html',
  styleUrls: ['./bathroom-pending.component.css']
})
export class BathroomPendingComponent implements OnInit {

  /*All items*/
  public pendingProducts: TaskModel[] = [];
  public bathroomProducts: ProductModel[] = [];
  public dates: string[] = [];
  public months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];

  checked:{[key: number]: boolean} = {};
  all = false;

  constructor(private taskService: TasksService, private productService: ProductService , private socketService: SocketsService) {}


  ngOnInit(): void {
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.taskService.getAll().subscribe((result) => {
      var i=0;
      for(let res of result){
        //Get Purchased items for bathroom
        if(res.status==="bathroom" && res.type==="Purchased"){
          this.pendingProducts.push(res);
          //Convert day
          var date = new Date(this.pendingProducts[i].createdAt)
          this.dates[i] = this.months[date.getMonth()]+". "+date.getDate()+", "+date.getHours()+":"+date.getMinutes();
          i++;
        }
      }
      console.log(this.pendingProducts)
      this.total();
    });
  }

  public checkAll(){
    console.log(this.pendingProducts.length)
    if(this.pendingProducts.length!==0){
      this.all = true;
      for(var i=0; i<this.pendingProducts.length; i++){
        this.checked[i]=true;
        this.update(i);
      }
    }
  }

  public checkItem(i:number){
    console.log("ITEM")
    this.checked[i]=true;
    this.update(i);
  }

  private update(i:number){
    //UPDATE LIST
    this.pendingProducts[i].type="Stored"
    this.taskService.update(this.pendingProducts[i]).subscribe((result) => {
      this.socketService.publish("tasks_update", this.pendingProducts[i]);
    });

    //UPDATE COUNTER
    var quantity = this.pendingProducts[i].quantity.split(' ')[0]
    console.log(quantity)
    console.log(this.pendingProducts[i].name)
    this.productService.getAll().subscribe((result) => {
      for(let res of result){
        if(res.name===this.pendingProducts[i].name){
          res.counter +=parseFloat(quantity);
          this.productService.update(res).subscribe((result) => {
            this.socketService.publish("tasks_update", res);
          });
        }
      }
      this.total();
    });
  }

  private total(){
    if(this.pendingProducts.length===0){
      const el = document.createElement('div');

      el.innerHTML = `
        <span style="text-align:center; color: #646464; text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1); font-size: 30px; font-weight:600; position:absolute; top:315px; left:40px;" >
          No Purchased items for bathroom!
        </span>
      `;
      el.setAttribute('title', 'my-title');
      const box = document.getElementById('box');

      box?.appendChild(el);
    }
  }


  faCalendarDays = faCalendarDays;
  faListOl = faListOl;
  faCheck = faCheck;

}

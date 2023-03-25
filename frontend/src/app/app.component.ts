import { Component, OnInit, AfterViewInit} from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ProductModel } from './global/models/product/product.model';
import { ShopModel } from './global/models/shops/shop.model';
import { SocketsService } from './global/services/sockets/sockets.service';
import { ProductService } from './global/services/tasks/products.service';
import { ShopService } from './global/services/tasks/shops.service';
import { HelmetService } from './global/services/tasks/helmet.service';
import { HelmetModel } from './global/models/helmet/helmet.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  destination = new HelmetModel();


  constructor(private router: Router,private helmetService: HelmetService,private socketService: SocketsService){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url.indexOf('/fridge') > -1 || this.router.url.indexOf('/bathroom') > -1 || this.router.url.indexOf('/reducer') > -1) {

      }else{

      }
    });

  }
  ngOnInit(): void{
    console.log("ME XENISTISSE PALI")
    //this.getAllTasks();
    this.helmetService.getAll().subscribe((result) => {
      console.log(result)
      //this.productsLength=re4;
      //console.log(this.productsLength)
      if(result.length===0){
        this.destination.start="asdfasdf";
        this.destination.finish="onomata";
        this.helmetService.create(this.destination).subscribe((result) => {
          console.log(this.destination)
          this.socketService.publish("tasks_update", this.destination);
        });
      }else{
        console.log(result);
      }

    });
  }

  private getAllTasks(): void {
    this.helmetService.getAll().subscribe((result) => {
      console.log(result)
      //console.log(this.productsLength)
      //console.log(result)
      //console.log(this.products[0]._id);
    });
  }

  //Delete Task
  public deleteTask(id:string): void {
    //const response = confirm("Are you sure you want to delete this task?");
    //if (response) {
      this.helmetService.delete(id).subscribe(() => {
        this.getAllTasks();
        this.socketService.publish("tasks_update", {});
      });
    //}
  }

  public addDestination(): void{
    this.helmetService.getAll().subscribe((result) => {
      console.log("vouvala")
      let start = document.getElementById('fname') as HTMLInputElement
      let finish = document.getElementById('lname') as HTMLInputElement
      this.destination._id = "qwe";
      this.destination.start = start.value
      this.destination.finish = finish.value

      console.log(this.destination.start+"------"+this.destination.finish);

      this.helmetService.create(this.destination).subscribe((result) => {
        console.log(this.destination)
        this.socketService.publish("tasks_update", this.destination);
      });
    });
  }
  ngAfterViewInit(): void {}
  title = 'Angular-app';
}

import { Component, OnInit } from '@angular/core';
import { faHeart, faXmark, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { TasksService } from 'src/app/global/services/tasks/tasks.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductService } from 'src/app/global/services/tasks/products.service';
import { ProductModel } from 'src/app/global/models/product/product.model';

@Component({
  selector: 'app-bathroom-like',
  templateUrl: './bathroom-like.component.html',
  styleUrls: ['./bathroom-like.component.css']
})
export class BathroomLikeComponent implements OnInit {

  public bathroomProducts: ProductModel[] = [];

  //done = false;
  done:{[key: number]: boolean} = {};

  //toggle Color
  color:{[key: number]: boolean} = {};

  //toggle Item
  item:{[key: number]: boolean} = {};

  constructor(private router: Router,private tasksService: TasksService,private productService: ProductService, private socketService: SocketsService) {}


  ngOnInit(): void {
    this.getAllTasks();
  }

  private getAllTasks(): void {
    var i = 0;
    this.productService.getAll().subscribe((result) => {
      for(let res of result){
        if(res.liked==true){
          if(res.name==="Toothbrush" || res.name==="Toothpaste" || res.name==="Dental Floss"){
            console.log(res.name)
            this.bathroomProducts.push(res)
          }
        }
      }


      for(const element of this.bathroomProducts){
        if(element.name==="Toothbrush"){
          //this.done[0]=true
          this.likedProducts(0)
        }else if(element.name==="Toothpaste"){
          //this.done[1]=true
          this.likedProducts(1)
        }else{
          //this.done[2]=true
          this.likedProducts(2)
        }
      }

    });
  }

  public likedProducts(i:number){
    this.item[i]=true;
    this.color[i]=true;
  }

  public emptyList(){
    const div = document.getElementById('listing');
    div!.innerHTML = '<div style="text-align:center; color: #8C8C8C; text-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1); font-size: 18px; font-weight:600; margin-top:30px; ">The List is Empty!</div>';
  }

  public deleteFavorite(product: ProductModel): void {
    console.log(product.name)
    product.liked=false;
    //UPDATE
    this.productService.update(product).subscribe((result) => {
      this.socketService.publish("tasks_update", product);
      window.location.reload();
    });
  }

  public back(){
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  faHeart = faHeart;
  faXmark = faXmark;
  faChevronRight = faChevronRight;
}

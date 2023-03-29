import { Component, OnInit } from '@angular/core';
import { faHeart, faXmark, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { TasksService } from 'src/app/global/services/tasks/tasks.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductService } from 'src/app/global/services/tasks/products.service';
import { ProductModel } from 'src/app/global/models/product/product.model';

@Component({
  selector: 'app-fridge-like',
  templateUrl: './fridge-like.component.html',
  styleUrls: ['./fridge-like.component.css']
})
export class FridgeLikeComponent implements OnInit {

  public allProducts: ProductModel[] = [];
  public fridgeProducts: ProductModel[] = [];

  //toggle Color
  color:{[key: number]: boolean} = {};

  constructor(private router: Router,private tasksService: TasksService,private productService: ProductService, private socketService: SocketsService) {}


  ngOnInit(): void {
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.productService.getAll().subscribe((result) => {
      for(let res of result){
        if(res.liked==true){
          this.allProducts.push(res)
          if(res.name==="Toothbrush" || res.name==="Toothpaste" || res.name==="Dental Floss"){
            //this.bathroomProducts.push(res)
          }else if(res.name==="Chips" || res.name==="Pop Corn" || res.name==="Biscuits"){
            //this.cupboardProducts.push(res)
          }else{
            this.fridgeProducts.push(res)
            console.log(res)
          }
        }
      }

      for(let i=0; i<this.allProducts.length; i++){
        this.likedProducts(i);
      }

      console.log("ALL I "+this.allProducts.length)
      if(this.allProducts.length===0)
        this.emptyList();

    });
  }

  public likedProducts(i:number){
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

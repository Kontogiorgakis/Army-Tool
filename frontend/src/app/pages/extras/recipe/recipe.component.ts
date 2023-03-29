import { Component, OnInit } from '@angular/core';
import {faFaceMeh} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/global/services/tasks/products.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { ProductModel } from 'src/app/global/models/product/product.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  public plus: boolean = false;

  constructor(private router: Router,private productService: ProductService,private socketService: SocketsService) {}

  ngOnInit(): void {
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.productService.getAll().subscribe((result) => {
      for(var res of result){
        if(res.name==="Chicken Breasts"){
          if(res.counter<0.38){
            this.changeUi();
          }
        }
      }
    });
  }

  public changeUi(){
    this.plus = true;
    document.getElementById('namePin')?.setAttribute("style","color:brown;")
    document.getElementById('quantityPin')?.setAttribute("style","color:brown;")
  }

  public addItem(){
    this.router.navigateByUrl('/add?tab=Chicken Breasts')
  }

  faFaceMeh = faFaceMeh;
}

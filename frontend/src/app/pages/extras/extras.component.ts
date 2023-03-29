import { Component, OnInit } from '@angular/core';
import {faSliders,
        faMagnifyingGlass,
        faChevronRight,
        faSmile,
        faFaceFrown,
        faFaceMeh,
        faClock} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  lunch:boolean = true;
  breakfast:boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public redirect(){
    this.router.navigateByUrl('/extras/recipe')
  }

  public redirectYogurt(){
    this.router.navigateByUrl('/extras/yogurt')
  }

  public curry(){
    console.log("laskaris")
  }

  public breakfasts(){
    document.getElementById('break')?.setAttribute("style","background: #594545; color: white; box-shadow: 0 5px 10px rgb(0 0 0 / 0.3);")
    document.getElementById('selected')?.setAttribute("style","background: white; color: black; box-shadow: none;")
    this.breakfast = true;
    this.lunch = false;
  }

  public lunches(){
    document.getElementById('selected')?.setAttribute("style","background: #594545; color: white; box-shadow: 0 5px 10px rgb(0 0 0 / 0.3);")
    document.getElementById('break')?.setAttribute("style","background: white; color: black; box-shadow: none;")
    this.lunch = true;
    this.breakfast = false;
  }

  faSliders = faSliders;
  faMagnifyingGlass = faMagnifyingGlass;
  faChevronRight = faChevronRight;
  faSmile = faSmile;
  faFaceFrown = faFaceFrown;
  faFaceMeh = faFaceMeh;
  faClock = faClock;
}

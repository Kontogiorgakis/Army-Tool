import { Component, OnInit, AfterViewInit} from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SocketsService } from './global/services/sockets/sockets.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private isFirstLoad: boolean = true;
  spin:boolean = false;


  constructor(private router: Router,private socketService: SocketsService){
  }
  ngOnInit(): void{
    //this.router.navigateByUrl('/homepage');
  }
}

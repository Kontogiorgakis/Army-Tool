import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { ProductService } from 'src/app/global/services/tasks/products.service';

@Component({
  selector: 'app-bathroom-panel',
  templateUrl: './bathroom-panel.component.html',
  styleUrls: ['./bathroom-panel.component.css']
})
export class BathroomPanelComponent implements OnInit {

  oral:boolean = false;

  constructor() {}

  ngOnInit(): void {
  }

  public oralRedirect(){
    document.getElementById('panel')?.setAttribute("style","filter:blur(3px); pointer-events:none;")
    this.oral=!this.oral
  }

}

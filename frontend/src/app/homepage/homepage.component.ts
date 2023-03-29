import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TasksService } from '../global/services/tasks/tasks.service';
import { SocketsService } from '../global/services/sockets/sockets.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  /*variables*/
  temperature:number = 0;
  weather:string = "";

  constructor(private router: Router,private tasksService: TasksService, private socketService: SocketsService) { }


  ngOnInit(): void {

    /*Get current position*/
    this.locationTranslator()

    /*Get weather*/
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Irákleion, GR&units=metric&appid=3ee3784983b57d56fbdcef2dcdd506eb`)
    .then((response) => {
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      this.temperature = data.main.temp;
    });
    //console.log("Tempa = "+this.temperature)
  }

  public locationTranslator(){

  }

  public openMaps(){
    this.router.navigateByUrl('/map')
  }

  faMagnifyingGlass = faMagnifyingGlass;
}

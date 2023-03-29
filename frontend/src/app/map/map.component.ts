import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  constructor() { }


  /*Create the map*/
  lat = 51.678418;
  lng = 7.809007;
  zoom = 10;

  ngOnInit(): void {
  }

}

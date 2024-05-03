import { Component } from '@angular/core';
import { FirstModel } from 'src/app/global/models/items/first.model';
import { FirstService } from 'src/app/global/services/first-soldiers/first.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {

  //ngIfs


  //Create Soldier
  soldier = new FirstModel();
  public let:boolean = false;

  constructor(private firstService: FirstService, private socketService: SocketsService, private location: Location) { }
  ngOnInit(): void {
  }

  public addSoldier(){
    if(!this.checkInputs()){
      alert("ΠΑΡΑΚΑΛΩ ΣΥΜΠΛΗΡΩΣΕ ΤΑ ΚΕΝΑ")
    }else{

      /*retrieve the values*/
      const firstName = document.getElementById('fname') as HTMLInputElement;
      const lastName = document.getElementById('lname') as HTMLInputElement;
      const company = document.getElementById('companyDropdown') as HTMLSelectElement;
      const esso = document.getElementById('essoDropdown') as HTMLSelectElement;
      const armed = document.getElementById('armedDropdown') as HTMLSelectElement;

      /*collide them*/
      this.soldier.fname = firstName.value;
      this.soldier.lname = lastName.value;
      this.soldier.company = company.value;
      this.soldier.armed = armed.value;
      this.soldier.availability = "ΠΑΡΩΝ"
      this.soldier.eso = esso.value;
      this.soldier.previousService = "NaN"
      this.soldier.note = "";
      this.firstService.getAll().subscribe((result) => {
        for (let res of result) {

          if(res.fname === this.soldier.fname && res.lname === this.soldier.lname && res.company === this.soldier.company){
            //alert("SOLDIER ALREADY EXISTS!")
            this.let = true;
            console.log(res.fname + " =!= "+ res.fname)
            console.log(res.lname + " =!= "+ res.lname)
            console.log(res.company + " =!= "+ res.company)
          }else{
            /*this.firstService.create(this.soldier).subscribe((result) => {
              this.socketService.publish("tasks_update", this.soldier);
              window.location.reload();
            })*/
          }
        }
        if(this.let===false){
          this.firstService.create(this.soldier).subscribe((result) => {
            this.socketService.publish("tasks_update", this.soldier);
            window.location.reload();
          })
        }else{
          alert("SOLDIER ALREADY EXISTS!")
        }
      });
    }
  }

  public checkInputs(){
    var fname = document.getElementById('fname') as HTMLInputElement; // Replace 'yourInputId' with the actual ID of your input element
    var lname = document.getElementById('lname') as HTMLInputElement;

    // Check if the input value is empty
    if (fname.value.trim() === '' || lname.value.trim() === '') {
      return false;
    } else {
      return true;
    }
  }
}

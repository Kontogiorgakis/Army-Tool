import { Component, Input  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'lodash';
import { FirstService } from 'src/app/global/services/first-soldiers/first.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent {

  /*Inputs*/
  @Input() name: string | undefined;
  @Input() company: string | undefined;
  @Input() fname: string | undefined;


  selectedOption: number = 1;


  constructor(private fb: FormBuilder,private firstService: FirstService, private socketService: SocketsService) { }


  ngOnInit() {
    // Initialize the first option as selected
    this.selectIt(1);
    console.log(this.name+" "+this.company);
  }

  selectIt(option: number): void {
    if (option === 2) {
      var whenElement = document.getElementById("when") as HTMLElement;
      whenElement.style.filter = "blur(0px)";
      whenElement.style.pointerEvents = "auto";
      var whenElement1 = document.getElementById("when1") as HTMLElement;
      whenElement1.style.filter = "blur(3px)";
      whenElement1.style.pointerEvents = "none";
      var whenElement2 = document.getElementById("when2") as HTMLElement;
      whenElement2.style.filter = "blur(3px)";
      whenElement2.style.pointerEvents = "none";
    } else if (option === 3) {
      var whenElement1 = document.getElementById("when1") as HTMLElement;
      whenElement1.style.filter = "blur(0px)";
      whenElement1.style.pointerEvents = "auto";
      var whenElement2 = document.getElementById("when2") as HTMLElement;
      whenElement2.style.filter = "blur(3px)";
      whenElement2.style.pointerEvents = "none";
      var whenElement = document.getElementById("when") as HTMLElement;
      whenElement.style.filter = "blur(3px)";
      whenElement.style.pointerEvents = "none";
    } else if (option === 4) {
      var whenElement2 = document.getElementById("when2") as HTMLElement;
      whenElement2.style.filter = "blur(0px)";
      whenElement2.style.pointerEvents = "auto";
      var whenElement1 = document.getElementById("when1") as HTMLElement;
      whenElement1.style.filter = "blur(3px)";
      whenElement1.style.pointerEvents = "none";
      var whenElement = document.getElementById("when") as HTMLElement;
      whenElement.style.filter = "blur(3px)";
      whenElement.style.pointerEvents = "none";
    } else {
      console.log("mat")
      var whenElement1 = document.getElementById("when1") as HTMLElement;
      whenElement1.style.filter = "blur(3px)";
      whenElement1.style.pointerEvents = "none";
      var whenElement2 = document.getElementById("when2") as HTMLElement;
      whenElement2.style.filter = "blur(3px)";
      whenElement2.style.pointerEvents = "none";
      var whenElement = document.getElementById("when") as HTMLElement;
      whenElement.style.filter = "blur(3px)";
      whenElement.style.pointerEvents = "none";
    }
    this.selectedOption = option;
  }


  // Define the function to check if a number is an integer within a specified range
  public isValidNumberInRange(value: string, min: number, max: number): boolean {
    const numRegex = /^[1-9][0-9]*$/; // Regular expression for positive integers excluding 0
    const isValidNumber = numRegex.test(value);
    const num = parseInt(value, 10);

    return isValidNumber && Number.isInteger(num) && num >= min && num <= max;
  }

  public changeAvailability(){
    console.log(this.selectedOption)

    /*take values*/
    if(this.selectedOption===3){
      var firstSince = document.getElementById("adFromFirst") as HTMLSelectElement;
      var secondSince = document.getElementById("adFromSec") as HTMLSelectElement;
      var firstTo = document.getElementById("adToFirst") as HTMLSelectElement;
      var seconTo = document.getElementById("adToSec") as HTMLSelectElement;

      /*Checks*/
      if ((!this.isValidNumberInRange(firstSince.value, 1, 31)) || (!this.isValidNumberInRange(secondSince.value, 1, 12)) || (!this.isValidNumberInRange(firstTo.value, 1, 31)) || (!this.isValidNumberInRange(seconTo.value, 1, 31))) {
        console.log("Error: ΑΔΕΙΑ - ΑΠΟ must be an integer between 1 and 31");
        return; // Exit the function or handle the error accordingly
      }

      console.log("ΑΔΕΙΑ ΑΠΟ "+firstSince.value+"/"+secondSince.value+" ΜΕΧΡΙ "+firstTo.value+"/"+seconTo.value)
    }else if(this.selectedOption===4){
      var firstSince = document.getElementById("apFromFirst") as HTMLSelectElement;
      var secondSince = document.getElementById("apFromSec") as HTMLSelectElement;
      var firstTo = document.getElementById("apToFirst") as HTMLSelectElement;
      var seconTo = document.getElementById("apToSec") as HTMLSelectElement;

      if ((!this.isValidNumberInRange(firstSince.value, 1, 31)) || (!this.isValidNumberInRange(secondSince.value, 1, 12)) || (!this.isValidNumberInRange(firstTo.value, 1, 31)) || (!this.isValidNumberInRange(seconTo.value, 1, 31))) {
        console.log("Error: ΑΔΕΙΑ - ΑΠΟ must be an integer between 1 and 31");
        return; // Exit the function or handle the error accordingly
      }
    }else if(this.selectedOption===2){
      var firstSince = document.getElementById("arFromFirst") as HTMLSelectElement;
      var secondSince = document.getElementById("arFromSec") as HTMLSelectElement;
      var firstTo = document.getElementById("arToFirst") as HTMLSelectElement;
      var seconTo = document.getElementById("arToSec") as HTMLSelectElement;

      if ((!this.isValidNumberInRange(firstSince.value, 1, 31)) || (!this.isValidNumberInRange(secondSince.value, 1, 12)) || (!this.isValidNumberInRange(firstTo.value, 1, 31)) || (!this.isValidNumberInRange(seconTo.value, 1, 31))) {
        console.log("Error: ΑΔΕΙΑ - ΑΠΟ must be an integer between 1 and 31");
        return; // Exit the function or handle the error accordingly
      }
    }

    this.firstService.getAll().subscribe((result) => {
      for (let res of result) {
        if (res.lname === this.name && res.fname === this.fname && res.company === this.company) {
          //console.log("giorgos")
          if(this.selectedOption===1){
            res.availability = "ΠΑΡΩΝ"
          }else if(this.selectedOption === 2){
            res.availability = "ΑΡΡΩΣΤΟΣ ΑΠΟ "+firstSince.value+"/"+secondSince.value+" ΜΕΧΡΙ "+firstTo.value+"/"+seconTo.value;
          }else if(this.selectedOption===4){
            res.availability = "ΑΠΟΣΠΑΣΗ ΑΠΟ "+firstSince.value+"/"+secondSince.value+" ΜΕΧΡΙ "+firstTo.value+"/"+seconTo.value;
          }else{
            res.availability = "ΑΔΕΙΑ ΑΠΟ "+firstSince.value+"/"+secondSince.value+" ΜΕΧΡΙ "+firstTo.value+"/"+seconTo.value;
          }
          //console.log(res.availability)
          this.firstService.update(res).subscribe((result) => {
            this.socketService.publish("tasks_update", res);
            window.location.reload();
          });
        }
      }
    });


  }


}



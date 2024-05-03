import { Component, Input } from '@angular/core';
import { FirstModel } from 'src/app/global/models/items/first.model';
import { FirstService } from 'src/app/global/services/first-soldiers/first.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { Location } from '@angular/common';
import { IpiresiesService } from 'src/app/global/services/ipiresies/ipiresies.service';
import { IpiresiesModel } from 'src/app/global/models/items/ipiresies';
import { TodayService } from 'src/app/global/services/today/today.service';
import { TodayModel } from 'src/app/global/models/items/today';


@Component({
  selector: 'app-give',
  templateUrl: './give.component.html',
  styleUrls: ['./give.component.css']
})
export class GiveComponent {

  /*Inputs*/
  @Input() name: string | undefined;
  @Input() company: string | undefined;
  @Input() fname: string | undefined;
  @Input() ability: string | undefined;


  //Numbers
  public noNumber:boolean = true;
  public yesNumber:boolean = false;
  public back:boolean = false;


  public numOfYes: number[] = [];
  public textOfButtons: string[] = [];
  private todayService:string = "";

  //aray of ipiresies
  //services
  public services:IpiresiesModel[] = [];


  //Create Soldier
  soldier = new FirstModel();
  public let:boolean = false;

  public divContainer:HTMLElement | null | undefined;

  ngAfterViewInit(): void {
    // After the component's view has been initialized, access the DOM element
    this.divContainer = document.getElementById('yesNumber');
  }

  constructor(private firstService: FirstService, private socketService: SocketsService, private location: Location, private IpiresiesService: IpiresiesService, private TodayService: TodayService, private SoldierService: FirstService) { }
  ngOnInit(): void {
    //console.log(this.name+" "+this.company);
    this.IpiresiesService.getAll().subscribe((result) => {
      for (let serv of result) {
        this.services.push(serv)
      }
    });

  }


  selectedButton: HTMLElement | null = null;

  // Define a variable to store the previously selected service name
  previousServiceName: string | null = null;

  public assignService(event: Event, serviceName: string, untilNow: number, numOfSoldiers: number) {
    if(numOfSoldiers!==0){
    // Remove "selected" class from the previously selected button
      if (this.selectedButton) {
        this.selectedButton.classList.remove('selected');
      }

      //Get service
      this.todayService = serviceName

      // Add "selected" class to the clicked button
      const targetElement = event.currentTarget as HTMLElement;
      if (targetElement) {
        if(serviceName==="ΚΕΝΤΡΙΚΗ ΠΥΛΗ" || serviceName==="ΠΕΡΙΠΟΛΟΣ"){
          if(numOfSoldiers===6 || numOfSoldiers===8){
            targetElement.classList.add('selected');
            // Update the selectedButton variable
            //this.selectedButton = targetElement;
          }
        }else if(serviceName==="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 1oυ" || serviceName==="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 2oυ"){
          if(numOfSoldiers===3 || numOfSoldiers===4){
            targetElement.classList.add('selected');
            // Update the selectedButton variable
            //this.selectedButton = targetElement;
          }
        }else{
          targetElement.classList.add('selected');
            // Update the selectedButton variable
            //this.selectedButton = targetElement;
        }
      }

      // Update counts based on previously selected service
      if (this.previousServiceName) {
        const previousService = this.services.find(serv => serv.serviceName === this.previousServiceName);
        if (previousService && previousService.untilNow > 0) {
          previousService.untilNow--;
        }
      }

      // Update counts based on the clicked service
      const clickedService = this.services.find(serv => serv.serviceName === serviceName);
      if (clickedService && clickedService.untilNow < clickedService.numOfSoldiers) {
        if(serviceName==="ΚΕΝΤΡΙΚΗ ΠΥΛΗ" || serviceName==="ΠΕΡΙΠΟΛΟΣ"){
          if(numOfSoldiers===6 || numOfSoldiers===8){
            clickedService.untilNow++;
          }
        }else if(serviceName==="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 1oυ" || serviceName==="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 2oυ"){
          if(numOfSoldiers===3 || numOfSoldiers===4){
            clickedService.untilNow++;
          }
        }else{
          clickedService.untilNow++;
          this.udpateNumber(0)
        }
      }

      // Update the previous service name
      this.previousServiceName = serviceName;
      if(serviceName==="ΚΕΝΤΡΙΚΗ ΠΥΛΗ" || serviceName==="ΠΕΡΙΠΟΛΟΣ" || serviceName==="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 1oυ" || serviceName==="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 2oυ"){
        this.numberManipulation(serviceName,untilNow,numOfSoldiers)
      }
    }else{
      alert("ΠΑΡΑΚΑΛΩ ΕΙΣΑΓΕΤΕ ΤΟΝ ΑΡΙΘΜΟ ΤΩΝ ΣΤΡΑΤΙΩΤΩΝ ΠΟΥ ΧΡΕΙΑΖΟΝΤΑΙ ΓΙΑ ΤΗΝ ΥΠΗΡΕΣΙΑ")
    }
  }

  public numberManipulation(serviceName: string, untilNow: number, numOfSoldiers: number) {
    //console.log(this.numOfYes)
    if (serviceName === "ΚΤΗΡΙΟΦΥΛΑΚΑΣ 1oυ" || serviceName === "ΚΤΗΡΙΟΦΥΛΑΚΑΣ 2oυ") {
      this.numOfYes = Array.from({length: numOfSoldiers}, (_, i) => i);
      if(numOfSoldiers!==3 && numOfSoldiers!==4){
        alert("ΛΑΘΟΣ ΑΡΙΘΜΟΣ ΣΤΡΑΤΙΩΤΩΝ")
      }else{
        this.noNumber = false;
        this.yesNumber = true;
        for (let i = 1; i <= numOfSoldiers; i++) {


          if (numOfSoldiers === 3) {
            //console.log("IGL2ΑΣΔΦ")
            if (i === 1) {
              this.textOfButtons.push(`${i}o ΝΟΥΜΕΡΟ ______ 15:00-18:00 ______ 00:00-02:00 ______ 06:00-09:00`)
            }
            if (i === 2) {
              this.textOfButtons.push(`${i}o ΝΟΥΜΕΡΟ ______ 18:00-21:00 ______ 02:00-04:00 ______ 09:00-12:00`)
            }
            if (i === 3) {
              this.textOfButtons.push(`${i}o ΝΟΥΜΕΡΟ ______ 21:00-00:00 ______ 04:00-06:00 ______ 12:00-15:00`)
            }
          } else if (numOfSoldiers === 4) {
            if (i === 1) {
              this.textOfButtons.push(`${i}o ΝΟΥΜΕΡΟ ______ 14:00-16:00 ______ 22:00-00:00 ______ 06:00-08:00`)
            }
            if (i === 2) {
              this.textOfButtons.push(`${i}o ΝΟΥΜΕΡΟ ______ 16:00-18:00 ______ 00:00-02:00 ______ 08:00-10:00`)
            }
            if (i === 3) {
              this.textOfButtons.push(`${i}o ΝΟΥΜΕΡΟ ______ 18:00-20:00 ______ 02:00-04:00 ______ 10:00-12:00`)
            }
            if (i === 4) {
              this.textOfButtons.push(`${i}o ΝΟΥΜΕΡΟ ______ 20:00-22:00 ______ 04:00-06:00 ______ 12:00-14:00`)
            }
          }
        }
      }
    }

    if (serviceName==="ΚΕΝΤΡΙΚΗ ΠΥΛΗ" || serviceName==="ΠΕΡΙΠΟΛΟΣ" ) {
      this.numOfYes = Array.from({length: numOfSoldiers/2}, (_, i) => i);
      if(numOfSoldiers!==6 && numOfSoldiers!==8){
        alert("ΛΑΘΟΣ ΑΡΙΘΜΟΣ ΣΤΡΑΤΙΩΤΩΝ")
      }else{
          this.noNumber = false;
          this.yesNumber = true;
          console.log("IGL2ΑΣΔΦ")
          if (numOfSoldiers === 6){
            this.textOfButtons.push(`1o ΝΟΥΜΕΡΟ ______ 15:00-18:00 ______ 00:00-02:00 ______ 06:00-09:00`)
            this.textOfButtons.push(`2o ΝΟΥΜΕΡΟ ______ 18:00-21:00 ______ 02:00-04:00 ______ 09:00-12:00`)
            this.textOfButtons.push(`3o ΝΟΥΜΕΡΟ ______ 21:00-00:00 ______ 04:00-06:00 ______ 12:00-15:00`)
          }else if (numOfSoldiers === 8) {
            this.textOfButtons.push(`1o ΝΟΥΜΕΡΟ ______ 14:00-16:00 ______ 22:00-00:00 ______ 06:00-08:00`)
            this.textOfButtons.push(`2o ΝΟΥΜΕΡΟ ______ 16:00-18:00 ______ 00:00-02:00 ______ 08:00-10:00`)
            this.textOfButtons.push(`3o ΝΟΥΜΕΡΟ ______ 18:00-20:00 ______ 02:00-04:00 ______ 10:00-12:00`)
            this.textOfButtons.push(`4o ΝΟΥΜΕΡΟ ______ 20:00-22:00 ______ 04:00-06:00 ______ 12:00-14:00`)

        }
      }

      /*Check for duplicates
      let counterMap = new Map();

      this.TodayService.getAll().subscribe((result) => {
        for (let serv of result) {
          if (counterMap.has(serv.numberOf)) {
            counterMap.set(serv.numberOf, counterMap.get(serv.numberOf) + 1);
          } else {
            counterMap.set(serv.numberOf, 1);
          }
        }

        for (let [numberOf, count] of counterMap.entries()) {
          if (count > 2) {
            console.log(`The numberOf ${numberOf-1} appears more than twice.`);
            var disabledButton = document.getElementById("numberus"+numberOf) as HTMLElement;
            disabledButton.style.opacity = "0.5";
            disabledButton.style.pointerEvents = "none";
            disabledButton.style.filter="grayscale(100%)";
          }
        }
      });*/

    }
  }

  public udpateNumber(i:number){
    //DELETER
    this.TodayService.getAll().subscribe((result) => {
      for (let serv of result) {
        this.TodayService.delete(serv._id).subscribe(() => {
          this.socketService.publish("taskdelete", this.soldier);
        })
      }

    });

    this.TodayService.getAll().subscribe((result) => {
      let todaySoldier = new TodayModel()
      let today:   Date = new Date();
      let flag=0;

      //udates
      let idFor:string = ""
      let serviceFor:string =""
      let numberFor:number = 0

      for (let serv of result) {
        console.log(serv)
        if(serv.lname === this.name &&  serv.fname === this.fname && serv.service===this.todayService && serv.numberOf ===i+1){
          flag=1; //already
        }else if(serv.lname === this.name &&  serv.fname === this.fname && serv.service===this.todayService && serv.numberOf !==i+1){
          flag=2; //update
          idFor = serv._id
          numberFor = i+1
        }else if(serv.lname === this.name &&  serv.fname === this.fname && serv.service!==this.todayService){
          flag=3; //update
          idFor = serv._id
          serviceFor = this.todayService
          if(this.todayService!=="ΚΕΝΤΡΙΚΗ ΠΥΛΗ" && this.todayService!=="ΠΕΡΙΠΟΛΟΣ" && this.todayService!=="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 1oυ" && this.todayService!=="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 2oυ"){
            numberFor=0;
          }else{
            numberFor = i+1;
          }
          console.log(serviceFor+" --- "+numberFor)
        }
      }

      if(flag===0){
        todaySoldier.fname = this.fname ?? ''
        todaySoldier.lname = this.name ?? ''
        todaySoldier.date = today.getDate().toString()
        todaySoldier.service = this.todayService
        if(todaySoldier.service!=="ΚΕΝΤΡΙΚΗ ΠΥΛΗ" && todaySoldier.service!=="ΠΕΡΙΠΟΛΟΣ" && todaySoldier.service!=="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 1oυ" && todaySoldier.service!=="ΚΤΗΡΙΟΦΥΛΑΚΑΣ 2oυ"){
          todaySoldier.numberOf=0;
        }else{
          todaySoldier.numberOf = i+1;
        }
        this.TodayService.create(todaySoldier).subscribe(() => {
          this.socketService.publish("tasks_update", this.soldier);
          this.noNumber = true;
          this.yesNumber = false;
        })
      }else if(flag===2){
        for (let serv of result){
          if(idFor === serv._id){
            serv.numberOf = numberFor
            this.TodayService.update(serv).subscribe(() => {
              this.socketService.publish("tasks_update", this.soldier);
              this.noNumber = true;
              this.yesNumber = false;
            })
          }
        }
      }else if(flag===3){
        console.log("IGLI BEJAJ")
        for (let serv of result){
          if(idFor === serv._id){
            serv.service = serviceFor
            serv.numberOf = numberFor
            console.log(serv.service+"  "+serv.numberOf)
            this.TodayService.update(serv).subscribe(() => {
              this.socketService.publish("tasks_update", this.soldier);
              this.noNumber = true;
              this.yesNumber = false;
            })
          }
        }
      }else{
        alert("Ο ΣΤΡΑΤΙΩΤΗΣ ΕΧΕΙ ΗΔΗ ΑΥΤΗ ΤΗΝ ΥΠΗΡΕΣΙΑ")
      }

      if(flag==0 || flag==2 || flag==3){
        this.IpiresiesService.getAll().subscribe((result) => {
          for (let ipiresia of result) {
            if(ipiresia.serviceName === this.todayService){
              ipiresia.untilNow = ipiresia.untilNow+1;
              console.log("Until Now "+ipiresia.untilNow)
              this.IpiresiesService.update(ipiresia).subscribe(() => {
                this.socketService.publish("tasks_update", ipiresia);
                window.location.reload();
              })
            }
          }
        })
      }

    });
  }

  public goBack(){
    this.noNumber = true;
    this.yesNumber = false;
  }
}





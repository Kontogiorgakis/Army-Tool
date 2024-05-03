import { Component, OnInit, Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { FirstModel } from '../global/models/items/first.model';
import { FirstService } from '../global/services/first-soldiers/first.service';
import { SocketsService } from '../global/services/sockets/sockets.service';

@Component({
  selector: 'app-soldiers',
  templateUrl: './soldiers.component.html',
  styleUrls: ['./soldiers.component.css']
})
export class SoldiersComponent implements OnInit {
  /*variables*/
  /*date*/
  today: Date = new Date();
  dayOfWeek: string = '';
  formattedDate: string = '';

  /*name to pass*/
  public lastNamePass: string="";
  public companyPass: string = "";
  public fnamePass: string = "";

  //buttons
  public addSection: boolean = false;
  public changeAver: boolean = false;
  public changeAvailability: boolean = false;
  public xCircle: boolean = false;
  public xCircle2: boolean = false;

  //search
  searchText = '';

  //Variable to store the selected company
  selectedCompany: string | null = null;

  // Define the desired company order
  desiredCompanyOrder: string[] = ['1ΟΣ ΛΟΧΟΣ', '2ΟΣ ΛΟΧΟΣ', '3ΟΣ ΛΟΧΟΣ', 'ΛΥΤ', 'ΛΔ'];

  //soldiers
  // Modify the data structure to organize soldiers by company
  public allSolds: { [key: string]: FirstModel[] } = {};
  public solds: { company: string, soldiers: FirstModel[] }[] = [];

  constructor(private router: Router, private firstService: FirstService, private socketService: SocketsService, private renderer: Renderer2) {}

  ngOnInit(): void {
    /*Get Locations*/
    this.firstService.getAll().subscribe((result) => {
      this.allSolds = this.organizeSoldiersByCompany(result);

      // Ensure that the desiredCompanyOrder is used to create the solds array
      this.solds = this.desiredCompanyOrder.map(company => ({
        company,
        soldiers: this.allSolds[company] || []
      }));
    });

    /*Get date and change the list*/
    this.dateVersusAvailability()
  }

  backToStart(){
    this.router.navigateByUrl('/homepage');
  }

  private dateVersusAvailability(){
    /*Check the main date with the adeia and apospasi date of everyone*/
    this.firstService.getAll().subscribe((result) => {
      for (let res of result) {
        if(res.availability!=="ΠΑΡΩΝ"){
          const text = res.availability;
          const matches = text.match(/\d{1,2}\/\d{1,2}/g);

          if (matches && matches.length === 2) {
            // Splitting the matches into start and end date parts
            const [startDay, startMonth] = matches[0].split('/');
            const [endDay, endMonth] = matches[1].split('/');

            // Converting the string parts into numbers
            const startDate = {
              day: parseInt(startDay, 10),
              month: parseInt(startMonth, 10)
            };
            const endDate = {
              day: parseInt(endDay, 10),
              month: parseInt(endMonth, 10)
            };
            const today = new Date();
            if (today.getDate() >= parseInt(endDay) && ((today.getMonth()+1) >= parseInt(endMonth))) {
              res.availability = "ΠΑΡΩΝ";
              this.firstService.update(res).subscribe((result) => {
                this.socketService.publish("tasks_update", res);
              });
              //window.location.reload();
          }
            //console.log(startDay, startMonth);
            //console.log(endDay, endMonth);

          } else {
            console.error('Invalid text format');
          }


        }
        //const text = res.availability;
          //const matches = text.match(/\d{1,2}\/\d{1,2}$/g);
          //console.log(text)
          /*if (matches) {
              const numbers = matches[0].split("/");
              console.log(numbers)
              const firstNumber = parseInt(numbers[0]);
              const secondNumber = parseInt(numbers[1]);

              // Get today's date
              const today = new Date();

              // Compare extracted day and month with today's day and month
              if (today.getDate() >= firstNumber && ((today.getMonth()+1) <= secondNumber)) {
                  res.availability = "ΠΑΡΩΝ";
                  console.log(today.getMonth())
                  console.log(today.getDate()+"  vs "+firstNumber)
                  console.log(today.getMonth()+"  VS "+secondNumber)
                  this.firstService.update(res).subscribe((result) => {
                    this.socketService.publish("tasks_update", res);
                  });
                  //window.location.reload();
              }
          } else {
              console.log("No matches found.");
          }*/
      }
    });
  }



  //sort alphabet
  private sortSoldiersAlphabetically(soldiers: FirstModel[]): FirstModel[] {
    return soldiers.sort((a, b) => a.lname.localeCompare(b.lname, 'el'));
  }

  private organizeSoldiersByCompany(soldiers: FirstModel[]): { [key: string]: FirstModel[] } {
    const organizedSoldiers: { [key: string]: FirstModel[] } = {};
    soldiers.forEach((soldier) => {
      if (!organizedSoldiers[soldier.company]) {
        organizedSoldiers[soldier.company] = [];
      }
      organizedSoldiers[soldier.company].push(soldier);
    });

    // Sort soldiers alphabetically within each company
    for (const key of Object.keys(organizedSoldiers)) {
      organizedSoldiers[key] = this.sortSoldiersAlphabetically(organizedSoldiers[key]);
    }

    return organizedSoldiers;
  }

  // Function to dynamically calculate the container height based on the number of soldiers
  public calculateContainerHeight(soldierCount: number): number {
    // Set a base height and add additional height based on the number of soldiers
    const baseHeight = 200; // Adjust this value as needed
    const additionalHeightPerSoldier = 55; // Adjust this value as needed

    return baseHeight + soldierCount * additionalHeightPerSoldier;
  }

  /*deletes*/
  public deleter() {
    this.firstService.getAll().subscribe((result) => {
      for (let res of result) {
        this.firstService.delete(res._id).subscribe(() => {
          this.socketService.publish("tasks_update", {});
        });
      }
    });
  }

  public deleteSoldier(item: FirstModel){
    const userConfirmed = window.confirm('Do you want to delete the soldier?');

    if (userConfirmed) {
      // User clicked "OK" or chose "Yes"
      this.firstService.delete(item._id).subscribe(() => {
        this.socketService.publish("tasks_update", {});
        this.ngOnInit()
      });
    }
  }

  public onSearchInputChange() {
    // Update displayed items whenever search text changes
    this.updateDisplayedItems();
  }

  public addSoldierToDatabase() {
    this.addSection = true;
    this.xCircle = true;
    this.blurDiv()
  }

  public closeSoldierSection() {
    this.addSection = false;
    this.xCircle = false;
    this.removeBlur()
  }

  /*Open availability*/
  openAvail(name: string, company: string, fname:string){
    this.changeAver = true;
    this.xCircle2 = true;
    this.lastNamePass = name;
    this.companyPass = company;
    this.fnamePass = fname
    this.blurDiv()
  }

  closeAvail(){
    this.changeAver = false;
    this.xCircle2 = false;
    this.removeBlur()
  }

  /*blur when add*/
   // Function to apply blur
   blurDiv() {
    const allDiv = document.getElementById('all') as HTMLElement;
    allDiv.style.filter = 'blur(3px)'; // Adjust the blur amount as needed
    // Make the div unclickable
    allDiv.style.pointerEvents = 'none';

    // Make the div unscrollable
    allDiv.style.overflow = 'none';
  }

  // Function to remove blur
  removeBlur() {
    const allDiv = document.getElementById('all') as HTMLElement;
    allDiv.style.filter = 'blur(0px)'; // Adjust the blur amount as needed
    // Make the div unclickable
    allDiv.style.pointerEvents = 'auto';

    // Make the div unscrollable
    allDiv.style.overflow = 'visible';
  }

  // Function to check if a company is selected
  public isCompanySelected(company: string): boolean {
    return this.selectedCompany === company;
  }

  private updateDisplayedItems() {
    if (this.selectedCompany) {
      // If a company is selected, filter items based on the selected company
      this.solds = [{
        company: this.selectedCompany,
        soldiers: this.allSolds[this.selectedCompany] || []
      }];
    } else {
      // If no company is selected, show only companies with corresponding soldiers
      this.solds = this.desiredCompanyOrder
        .filter(company => this.allSolds[company] && this.allSolds[company].length > 0)
        .map(company => ({
          company,
          soldiers: this.allSolds[company] || []
        }));
    }

    // Filter items based on search text in fname and lname
    this.solds.forEach((companySoldiers) => {
      companySoldiers.soldiers = companySoldiers.soldiers.filter(item =>
        item.fname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.lname.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  public updateBackend(company: string) {
    // Toggle the selected company
    this.selectedCompany = this.selectedCompany === company ? null : company;

    // Update displayed items based on the selected company
    this.updateDisplayedItems();
  }


  /*NOTES*/
  // Inside your SoldiersComponent class
  public calculateNoteWidth(note: string): number {
    // Set a base width and add additional width based on the length of the note
    const baseWidth = 150; // Adjust this value as needed
    const additionalWidthPerCharacter = 8; // Adjust this value as needed

    return baseWidth + note.length * additionalWidthPerCharacter;
  }

  public onEnterKey(event: any, item: FirstModel): void {
    // Prevent the default behavior of the Enter key to avoid creating a new line
    event.preventDefault();

    // Trigger the blur event to stop editing
    const targetElement = event.target as HTMLElement;
    targetElement.blur();
  }

  public onNoteInputChange(event:any,item: FirstModel): void {
    this.firstService.getAll().subscribe((result) => {
      for (let res of result) {
        if (res.lname === item.lname && res.company === item.company) {
          res.note =  event.target.textContent;
          this.firstService.update(res).subscribe((result) => {
            this.socketService.publish("tasks_update", res);
            if((item.note === ""  && res.note==="") || item.note === res.note){
              console.log("Cant reload!")
            }else{
              //window.location.href = '/soldiers'; // Reload the current URL
            }
            // Move the console.log outside of the loop
          });
        }
      }
    });

  }

  // Define the dropdown options
  public dropdownOptions: string[] = ['ΠΑΡΩΝ', 'ΑΔΕΙΑ', 'ΑΠΟΣΠΑΣΗ', 'ΑΡΡΩΣΤΟΣ'];

  // Function to update the availability value
  public updateAvailability(item: FirstModel, selectedOption: string): void {
    item.availability = selectedOption;

    // Update the backend and trigger other necessary actions
    //this.updateBackend(item.company);
  }


}

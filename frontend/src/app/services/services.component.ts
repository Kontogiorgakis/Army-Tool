import { Component, OnInit, Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { FirstModel } from '../global/models/items/first.model';
import { FirstService } from '../global/services/first-soldiers/first.service';
import { SocketsService } from '../global/services/sockets/sockets.service';
import { IpiresiesModel } from '../global/models/items/ipiresies';
import { IpiresiesService } from '../global/services/ipiresies/ipiresies.service';
import { TodayService } from '../global/services/today/today.service';
import { of } from 'rxjs';
import { counter } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit{
  /*variables*/
  /*date*/
  today: Date = new Date();
  dayOfWeek: string = '';
  formattedDate: string = '';

  /*name to pass*/
  public lastNamePass: string="";
  public companyPass: string = "";
  public abilityPass: string= "";
  public fnamePass: string = "";

  //buttons
  public addSection: boolean = false;
  public changeAver: boolean = false;
  public changeAvailability: boolean = false;
  public xCircle: boolean = false;
  public xCircle2: boolean = false;

  //services
  public services:IpiresiesModel[] = [];
  public todayServices: string[] = [];


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

  constructor(private router: Router, private firstService: FirstService, private socketService: SocketsService, private renderer: Renderer2, private IpiresiesService: IpiresiesService,private TodayService: TodayService) {}

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
    this.displayForSoldiers();
    this.checkTodaySoldiers()
    this.dateVersusAvailability()
    this.createServices()
    this.fillServices()
    this.showService()
  }

  public displayForSoldiers(){

    this.firstService.getAll().subscribe((result) => {
      this.TodayService.getAll().subscribe((todays) => {
        let i=0;
        for (let res of result) {
          this.todayServices.push("")
          for (let tod of todays) {
            if (tod.lname === tod.fname && res.lname === tod.lname) {
              this.todayServices[i] = tod.service;
            }
          }
          i++;
        }
        console.log(this.todayServices)
      });
    });
  }

  checkTodaySoldiers(){
    this.IpiresiesService.getAll().subscribe((result) => {
      this.TodayService.getAll().subscribe((todays) => {
        if(todays.length === 0){
          for (let res of result) {
            res.untilNow = 0;
            this.IpiresiesService.update(res).subscribe((result) => {
              this.socketService.publish("tasks_update", res);
            });
          }
        }else{
          let counter = 0;
          for (let res of result) {
            for (let today of todays) {
              if(res.serviceName === today.service){
                counter++;
              }
            }
            res.untilNow = counter;
            this.IpiresiesService.update(res).subscribe((result) => {
              this.socketService.publish("tasks_update", res);
            });
            counter = 0;
          }
        }
      });
    });
  }


  private createServices(){
    /*Default services*/

    //kentriki pili
    let pili = new IpiresiesModel()
    pili.serviceName = "ΚΕΝΤΡΙΚΗ ΠΥΛΗ"
    pili.numOfSoldiers = 6
    pili.untilNow = 0
    this.services.push(pili)

    let ktir1 = new IpiresiesModel()
    ktir1.serviceName = "ΚΤΗΡΙΟΦΥΛΑΚΑΣ 1oυ"
    ktir1.numOfSoldiers = 3
    ktir1.untilNow = 0
    this.services.push(ktir1)

    let ktir2 = new IpiresiesModel()
    ktir2.serviceName = "ΚΤΗΡΙΟΦΥΛΑΚΑΣ 2oυ"
    ktir2.numOfSoldiers = 3
    ktir2.untilNow = 0
    this.services.push(ktir2)

    let mageiras = new IpiresiesModel()
    mageiras.serviceName = "ΜΑΓΕΙΡΑΣ"
    mageiras.numOfSoldiers = 1
    mageiras.untilNow = 0
    this.services.push(mageiras)

    let odigos = new IpiresiesModel()
    odigos.serviceName = "ΟΔΗΓΟΣ ΠΕΡΙΠΟΛΟΥ"
    odigos.numOfSoldiers = 1
    odigos.untilNow = 0
    this.services.push(odigos)

    let sitistis = new IpiresiesModel()
    sitistis.serviceName = "ΣΙΤΙΣΤΗΣ"
    sitistis.numOfSoldiers = 1
    sitistis.untilNow = 0
    this.services.push(sitistis)

    let nosokomos = new IpiresiesModel()
    nosokomos.serviceName = "ΝΟΣΟΚΟΜΟΣ"
    nosokomos.numOfSoldiers = 1
    nosokomos.untilNow = 0
    this.services.push(nosokomos)

    let kepik = new IpiresiesModel()
    kepik.serviceName = "ΚΕΠΙΚ"
    kepik.numOfSoldiers = 1
    kepik.untilNow = 0
    this.services.push(kepik)

    let am = new IpiresiesModel()
    am.serviceName = "ΑΜ"
    am.numOfSoldiers = 1
    am.untilNow = 0
    this.services.push(am)

    let estiatoras = new IpiresiesModel()
    estiatoras.serviceName = "ΕΣΤΙΑΤΟΡΑΣ"
    estiatoras.numOfSoldiers = 1
    estiatoras.untilNow = 0
    this.services.push(estiatoras)

    let lantza = new IpiresiesModel()
    lantza.serviceName = "ΛΑΝΤΖΑ"
    lantza.numOfSoldiers = 2
    lantza.untilNow = 0
    this.services.push(lantza)

    let epifilaki = new IpiresiesModel()
    epifilaki.serviceName = "ΕΠΙΦΥΛΑΚΗ"
    epifilaki.numOfSoldiers = 2
    epifilaki.untilNow = 0
    this.services.push(epifilaki)

    let peripolo = new IpiresiesModel()
    peripolo.serviceName = "ΠΕΡΙΠΟΛΟΣ"
    peripolo.numOfSoldiers = 0
    peripolo.untilNow = 0
    this.services.push(peripolo)

    this.IpiresiesService.getAll().subscribe((result) => {
      if(result.length === 0){
        for (let serv of this.services) {
          //console.log(serv.serviceName)
          this.IpiresiesService.create(serv).subscribe((result) => {
            this.socketService.publish("tasks_update", serv);
            //window.location.reload();
          })
        }
      }/*else{
        for (let serv of result) {
          console.log(serv.serviceName)
          this.IpiresiesService.delete(serv._id).subscribe((result) => {
            this.socketService.publish("tasks_update", serv);
            //window.location.reload();
          })
        }
      }*/
    });

  }

  public fillServices(){
    this.IpiresiesService.getAll().subscribe((result) => {
      if(result.length === 0){
        for (let serv of this.services) {
         this.services.push(serv);
        }
      }
    });
    this.generateButtons();
  }

  generateButtons(): void {
    this.showService()
    const buttonsPerRow = 5; // Number of buttons per row
    const buttonWidth = 260; // Width of each button in pixels
    const buttonHeight = 60; // Height of each button in pixels
    const borderRadius = 25; // Border radius of each button in pixels
    const fontSize = 16; // Font size of the service name in pixels

    const servicesDiv = document.getElementById('services');

    if (servicesDiv) {
      servicesDiv.innerHTML = ''; // Clear existing content

      let rowDiv: HTMLDivElement | null = null;


      //TEST
      this.IpiresiesService.getAll().subscribe((result) => {
        this.services = [];
        for (let res of result) {
          //console.log(res.serviceName +" "+res.untilNow+" LELI ")
          this.services.push(res);
          console.log(this.services)
        }
        this.services.forEach((service, index) => {
         // console.log(service.untilNow)
          if (index % buttonsPerRow === 0) {
            rowDiv = document.createElement('div');
            rowDiv.classList.add('button-row');
            servicesDiv?.appendChild(rowDiv);
          }

          if (rowDiv) {
            const button = document.createElement('button');
            button.classList.add('service-button');

            // Inline CSS styling for the button
            button.style.width = `${buttonWidth}px`;
            button.style.height = `${buttonHeight}px`;
            button.style.borderRadius = `${borderRadius}px`;
            button.style.backgroundColor = 'rgb(198, 198, 128)'; // Set background color to yellow
            button.style.border = 'none';
            button.style.margin = '20px';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '4px 4px 4px rgba(0, 0, 0, 0.3)'; // Add box-shadow

            const serviceNameSpan = document.createElement('span');
            serviceNameSpan.textContent = service.serviceName;
            serviceNameSpan.style.fontSize = `${fontSize}px`;
            serviceNameSpan.style.padding = '10px';

            const numOfSoldiersSpan = document.createElement('span');
            //console.log(service.untilNow)
            numOfSoldiersSpan.textContent = `${service.untilNow}/${service.numOfSoldiers}`;

            numOfSoldiersSpan.style.fontWeight = '700';
            numOfSoldiersSpan.style.fontSize = '18px';

            // Create input field for editing numOfSoldiers
            const inputField = document.createElement('input');
            inputField.type = 'number';
            inputField.style.display = 'none'; // Initially hidden
            inputField.value = service.numOfSoldiers.toString();
            inputField.addEventListener('blur', () => {
              numOfSoldiersSpan.style.display = 'inline-block';
              inputField.style.display = 'none';
              numOfSoldiersSpan.textContent = `${service.untilNow}/${inputField.value}`;
              //console.log("out")

              //out it
              this.IpiresiesService.getAll().subscribe((result) => {
                for (let serv of result) {
                  if(serv.serviceName === service.serviceName){
                    //console.log(serv.serviceName +" "+serv.numOfSoldiers+" LELI ")
                    serv.numOfSoldiers = parseInt(inputField.value);
                    this.IpiresiesService.update(serv).subscribe(() => {
                      this.socketService.publish("tasks_update", serv);

                    })
                  }
                }
              });
            });


            if (service.serviceName === 'ΚΤΗΡΙΟΦΥΛΑΚΑΣ 1ου' || service.serviceName === 'ΚΤΗΡΙΟΦΥΛΑΚΑΣ 2ου') {
              inputField.addEventListener('input', () => {
                const value = parseInt(inputField.value);
                if (value < 3) {
                  inputField.value = '3';
                } else if (value > 4) {
                  inputField.value = '4 ';
                }
              });
            }

            button.appendChild(serviceNameSpan);
            button.appendChild(numOfSoldiersSpan);
            button.appendChild(inputField);
            rowDiv.appendChild(button);

            // Event listener to toggle display of input field on button click
            button.addEventListener('click', () => {
              numOfSoldiersSpan.style.display = 'none';
              inputField.style.display = 'inline-block';
              inputField.focus();

            });
          }
        });
      });
    }
  }


  /*-------------------------------------------------------------------------------------------------------------*/

  public closeService(){
    this.addSection = false;
  }

  public giveService(fname:string, lname:string, ability:string, company:string){
    //console.log("niaou")
    //this.xCircle2 = true;
    this.lastNamePass = lname;
    this.companyPass = company;
    this.abilityPass = ability;
    this.fnamePass = fname
    this.addSection = true;
    //this.blurDiv()
  }

  /*-------------------------------------------------------------------------------------------------------------*/


  backToStart(){
    this.router.navigateByUrl('/homepage');
  }

  private dateVersusAvailability(){
    /*Check the main date with the adeia and apospasi date of everyone*/
    this.firstService.getAll().subscribe((result) => {
      for (let res of result) {
          const text = res.availability;
          const matches = text.match(/\d{1,2}\/\d{1,2}$/g);

          if (matches) {
              const numbers = matches[0].split("/");
              const firstNumber = parseInt(numbers[0]);
              const secondNumber = parseInt(numbers[1]);

              // Get today's date
              const today = new Date();

              // Compare extracted day and month with today's day and month
              if (today.getDate() >= firstNumber && (today.getMonth() + 1) <= secondNumber) {
                  res.availability = "ΠΑΡΩΝ";
                  //console.log("mat mat")
                  this.firstService.update(res).subscribe((result) => {
                    this.socketService.publish("tasks_update", res);
                  });
                  //window.location.reload();
              }
          } else {
              //console.log("No matches found.");
          }
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

  public onSearchInputChange() {
    // Update displayed items whenever search text changes
    this.updateDisplayedItems();
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

  /*Show on frontend the service of the soldier*/
  public showService(){
    this.TodayService.getAll().subscribe((result) => {
      this.firstService.getAll().subscribe((first) => {
       for(let ef of first){
        for (let res of result){
          if(ef.lname === res.lname){
            //console.log(ef.lname + "  "+res.service)
          }
        }
       }
      })
    })
  }
}

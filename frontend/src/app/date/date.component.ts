import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit, OnDestroy {

  today: Date = new Date();
  dayOfWeek: string = '';
  formattedDate: string = '';
  private intervalId: any;

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    this.updateDayAndDate();

    // Check for day change every second
    this.intervalId = setInterval(() => {
      this.ngZone.run(() => {
        this.checkForDayChange();
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateDayAndDate() {
    //const date = new Date(2024, 0, 1); // January is represented by 0
    //this.setNewDate(date)
    // Get the day of the week
    const daysOfWeek = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
    this.dayOfWeek = daysOfWeek[this.today.getDay()];

    // Format the date
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
    this.formattedDate = this.today.toLocaleDateString('el-GR', options);
  }

  checkForDayChange() {
    const newDay = new Date().getDate();
    if (newDay !== this.today.getDate()) {
      // Day has changed, reload the page
      //window.location.reload();
    }
  }

  // Method to set a new date (for testing)
  setNewDate(date: Date) {
    this.today = date;
    this.updateDayAndDate();
  }
}

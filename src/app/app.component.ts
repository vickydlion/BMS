import { Component } from '@angular/core';
import { AUDI1 } from './sample-data/Audi1';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  // AUDI1 sample-data has following structure
  // CATEGORY : {name:string, price:number, rows:Array<Row>}
  // ROW:{name:string, seats:Array<seats>}
  // SEAT: {no: number, isAvailable: boolean ,isBooked: boolean, isSelected: boolean, surgedPrice: number}
  currentAudiData = AUDI1;
  numberOfSeatOptions = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
  // initialized with default values
  selectedSeats = [];
  totalPrice = 0;
  seatsToBeBooked = 5;

  selectSeat(category, row, seat, seatIndex) {
    // case if we have already selected required seats
    if (+this.seatsToBeBooked === this.selectedSeats.length) {
      // if current seat is selected and next to it is either booked or pre selected then do nothing and return
      if (seat.isSelected) {
        if (!row.seats[seatIndex + 1].isAvailable) {
          return;
        }
      }
      // now we know we can start selection again so re-setting selected Seats and total price
      this.resetSelectedSeatsAndTotalPrice();
    }
    // checking that current seat should not already be selected if not then will proceed
    if (this.selectedSeats.indexOf(seat) === -1) {
      seat.isSelected = true;
      seat.isAvailable = false;
      this.addSeatAndUpdateTotalPrice(category, seat);
      this.selectMoreIfContinuousSeatsAvailable(category, row, seat, seatIndex);
    }
  }

  selectMoreIfContinuousSeatsAvailable(category, row, seat, seatIndex) {
    let nextSeat = row.seats[++seatIndex];
    while (nextSeat && nextSeat.isAvailable && this.selectedSeats.length < +this.seatsToBeBooked) {
      nextSeat.isSelected = true;
      nextSeat.isAvailable = false;
      this.addSeatAndUpdateTotalPrice(category, nextSeat);
      nextSeat = row.seats[++seatIndex];
    }
  }

  // for adding seats to selectedSeats Array and updating total price
  addSeatAndUpdateTotalPrice(category, seat) {
    this.selectedSeats.push(seat);
    this.totalPrice += category.price + (seat.surgedPrice || 0); // adding surged price if any along with category price
  }

  // for re-setting  selectedSeats and totalPrice
  resetSelectedSeatsAndTotalPrice() {
    this.selectedSeats.forEach((selectedSeat) => {
      selectedSeat.isSelected = false;
      selectedSeat.isAvailable = true;
    });
    this.selectedSeats = [];
    this.totalPrice = 0;
  }
}

import { Component } from '@angular/core'
import { CustomerService } from '../../services/customer.service'
import { ActivatedRoute } from '@angular/router'
import { StorageService } from '../../../../auth/components/services/storage/storage.service'

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent {
  constructor(private service: CustomerService) {}

  bookings: any[] = []
  isSpinning = false

  ngOnInit() {
    this.getBookingsByUserId()
  }

  private getBookingsByUserId() {
    this.isSpinning = true

    this.service.getBookingsByUserId().subscribe(
      data => {
        this.bookings = data
        this.isSpinning = false
        console.log('Bookings received:', data);
      },
      error => {
        console.log(error)
        this.isSpinning = false
      }
    )
  }

 cancelBooking(booking: any) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  this.isSpinning = true;
  this.service.cancelBookingById(booking.id).subscribe({
    next: () => {
      booking.bookCarStatus = 'CANCELLED';
      this.isSpinning = false;
      console.log('Booking cancelled:', booking); // ✅ Add this
    },
    error: err => {
      console.error('Cancel failed', err); // ✅ Watch the console here
      this.isSpinning = false;
    }
  });
}


}

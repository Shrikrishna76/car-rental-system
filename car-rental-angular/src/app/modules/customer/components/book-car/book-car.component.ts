import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CustomerService } from '../../services/customer.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { StorageService } from '../../../../auth/components/services/storage/storage.service'
import { NzMessageService } from 'ng-zorro-antd/message'

const DATE_FORMAT = 'MM-DD-YYYY'

@Component({
  selector: 'app-book-car',
  templateUrl: './book-car.component.html',
  styleUrl: './book-car.component.scss'
})
export class BookCarComponent {

  days: number | null = null;
  totalPrice: number = 0;

  constructor(
    private service: CustomerService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  carId: number = this.activeRoute.snapshot.params['id']
  car: any
  validateForm!: FormGroup
  isSpinning: boolean = false
  errorMessage: string = '';

 

  ngOnInit() {
    this.validateForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    })

    this.getCarById()
  }

  private getCarById() {
    this.service.getCarById(this.carId).subscribe(res => {
      this.car = res
      this.car.processedImage = `data:image/jpeg;base64,${res.returnedImage}`
    })
  }

calculateDays() {
  const from = new Date(this.validateForm.value.fromDate);
  const to = new Date(this.validateForm.value.toDate);

  if (from && to && to > from) {
    const diffTime = Math.abs(to.getTime() - from.getTime());
    this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.totalPrice = this.days * this.car.price;
  } else {
    this.days = null;
    this.totalPrice = 0;
  }
}


bookACar() {
  if (this.validateForm.invalid) {
    this.message.error('Please fill all required fields');
    return;
  }

  const formData = this.validateForm.value;
  const fromDate = new Date(formData.fromDate);
  const toDate = new Date(formData.toDate);

  // Show message only if dates are filled AND invalid
  if (toDate <= fromDate) {
    this.message.error('Select appropriate date: To Date must be after From Date');
    return;
  }

  const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
  this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  this.totalPrice = this.days * this.car.price;

  const bookACarDto = {
    fromDate,
    toDate,
    userId: StorageService.getUserId(),
    carId: this.carId,
    days: this.days,
    price: this.totalPrice,
    pickupLocation: formData.pickupLocation
  };

  this.isSpinning = true;

  this.service.bookACar(bookACarDto).subscribe(
    res => {
      this.isSpinning = false;
      this.message.success('Car booked successfully');
      this.router.navigateByUrl('/customer/dashboard');
    },
    err => {
      this.isSpinning = false;
      this.message.error('Booking failed');
    }
  );
}
}
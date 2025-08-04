import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent {
  cars: any[] = [];

  constructor(private service: CustomerService) {}

  ngOnInit() {
    this.getAllCars();
  }

  getAllCars() {
    this.service.getAllCars().subscribe(res => {
      this.cars = res.map((car: any) => ({
        ...car,
        processedImage: `data:image/jpeg;base64,${car.returnedImage}`
      }));
    });
  }
}

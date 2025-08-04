import { Component } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AdminService } from '../../services/admin.service'

@Component({
  selector: 'app-search-car',
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.scss']
})
export class SearchCarComponent {
  searchCarForm!: FormGroup
  listOfBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Lexus']
  listOfType = ['Sports Car', 'Diesel', 'Crossover', 'Luxury Car']
  listOfColor = ['Red', 'Blue', 'Brown', 'Green']
  listOfTransmission = ['Manual', 'Automatic']

  isSpinning = false
  showResults = false
  cars: any[] = []

  constructor(private fb: FormBuilder, private service: AdminService) {
    this.searchCarForm = this.fb.group({
      brand: [null],
      type: [null],
      transmission: [null],
      color: [null]
    })
  }

  searchCar() {
    if (this.searchCarForm.valid) {
      this.isSpinning = true
      this.cars = []

      this.service.searchCar(this.searchCarForm.value).subscribe(
        res => {
          this.isSpinning = false
          let carDtoList = res.carDtoList

          // ✅ If single object, convert to array
          if (!Array.isArray(carDtoList)) {
            carDtoList = [carDtoList]
          }

          // ✅ Process images safely
          this.cars = carDtoList.map((car: any) => ({
            ...car,
            processedImage: car.returnedImage
              ? `data:image/jpeg;base64,${car.returnedImage}`
              : 'assets/no-car-image.jpg'
          }))

          this.showResults = true
        },
        err => {
          this.isSpinning = false
          console.error('Search failed', err)
        }
      )
    }
  }

  backToSearch() {
    this.showResults = false
    this.cars = []
    this.searchCarForm.reset()
  }
}

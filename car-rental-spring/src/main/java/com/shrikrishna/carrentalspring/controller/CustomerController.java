package com.shrikrishna.carrentalspring.controller;

import com.shrikrishna.carrentalspring.dto.BookACarDto;
import com.shrikrishna.carrentalspring.dto.CarDto;
import com.shrikrishna.carrentalspring.dto.SearchCarDto;
import com.shrikrishna.carrentalspring.services.customer.CustomerService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping("/cars")
    public ResponseEntity<List<CarDto>> getAllCars() {
        return ResponseEntity.ok(customerService.getAllCars());
    }

    @PostMapping("/car/book")
    public ResponseEntity<Void> bookACar(@RequestBody BookACarDto bookACarDto) {
        boolean isSuccessful = customerService.bookACar(bookACarDto);

        if (isSuccessful) {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<CarDto> getCarById(@PathVariable Long carId) {
        CarDto carDto = customerService.getCarById(carId);

        if (carDto != null) {
            return ResponseEntity.ok(carDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/car/bookings/{userId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<List<BookACarDto>> getBookingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(customerService.getBookingsByUserId(userId));
    }
    
    
    @PutMapping("/car/cancel/{bookingId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId) {
        boolean cancelled = customerService.cancelBooking(bookingId);
        if (cancelled) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    
    @PostMapping("/car/search")
    public ResponseEntity<?> searchCar(@RequestBody SearchCarDto searchCarDto) {
        return ResponseEntity.ok(customerService.searchCar(searchCarDto));
    }

}

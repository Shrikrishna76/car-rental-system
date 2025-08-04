package com.shrikrishna.carrentalspring.services.customer;

import java.util.List;

import com.shrikrishna.carrentalspring.dto.BookACarDto;
import com.shrikrishna.carrentalspring.dto.CarDto;
import com.shrikrishna.carrentalspring.dto.CarDtoListDto;
import com.shrikrishna.carrentalspring.dto.SearchCarDto;

public interface CustomerService {
    List<CarDto> getAllCars();

    boolean bookACar(BookACarDto bookACarDto);

    CarDto getCarById(Long id);

    List<BookACarDto> getBookingsByUserId(Long id);
    
    boolean cancelBooking(Long bookingId);
    
    CarDtoListDto searchCar(SearchCarDto searchCarDto);

}

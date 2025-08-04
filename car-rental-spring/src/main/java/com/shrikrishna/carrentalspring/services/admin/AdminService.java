package com.shrikrishna.carrentalspring.services.admin;

import java.io.IOException;
import java.util.List;

import com.shrikrishna.carrentalspring.dto.BookACarDto;
import com.shrikrishna.carrentalspring.dto.CarDto;
import com.shrikrishna.carrentalspring.dto.CarDtoListDto;
import com.shrikrishna.carrentalspring.dto.SearchCarDto;

public interface AdminService {
    boolean postCar(CarDto carDto) throws IOException;

    List<CarDto> getAllCars();

    void deleteCar(Long id);

    CarDto getCarById(Long id);

    boolean updateCar(Long id, CarDto carDto) throws IOException;

    List<BookACarDto> getBookings();


    boolean changeBookingStatus(Long id, String status);

    CarDtoListDto searchCar(SearchCarDto searchCarDto);
}

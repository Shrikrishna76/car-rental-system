package com.shrikrishna.carrentalspring.services.customer;

import com.shrikrishna.carrentalspring.dto.BookACarDto;
import com.shrikrishna.carrentalspring.dto.CarDto;
import com.shrikrishna.carrentalspring.dto.CarDtoListDto;
import com.shrikrishna.carrentalspring.dto.SearchCarDto;
import com.shrikrishna.carrentalspring.entity.BookACar;
import com.shrikrishna.carrentalspring.entity.Car;
import com.shrikrishna.carrentalspring.entity.User;
import com.shrikrishna.carrentalspring.enums.BookCarStatus;
import com.shrikrishna.carrentalspring.repository.BookACarRepository;
import com.shrikrishna.carrentalspring.repository.CarRepository;
import com.shrikrishna.carrentalspring.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final BookACarRepository bookACarRepository;

    @Override
    public List<CarDto> getAllCars() {
        return carRepository.findAll().stream().map(Car::getCarDto).collect(Collectors.toList());
    }

//    @Override
//    public boolean bookACar(BookACarDto bookACarDto) {
//        Optional<Car> optionalCar = carRepository.findById(bookACarDto.getCarId());
//        Optional<User> optionalUser = userRepository.findById(bookACarDto.getUserId());
//
//        if (optionalCar.isPresent() && optionalUser.isPresent()) {
//            Car existingCar = optionalCar.get();
//
//            BookACar bookACar = new BookACar();
//            bookACar.setUser(optionalUser.get());
//            bookACar.setCar(existingCar);
//            bookACar.setBookCarStatus(BookCarStatus.PENDING);
//
//            long diffInMilliSeconds = bookACarDto.getToDate().getTime() - bookACarDto.getFromDate().getTime();
//            long days = TimeUnit.MICROSECONDS.toDays(diffInMilliSeconds);
//
//            bookACar.setDays(days);
//            bookACar.setPrice(days * existingCar.getPrice());
//
//            bookACarRepository.save(bookACar);
//            return true;
//        }
//
//        return false;
//    }
    
    @Override
    public boolean bookACar(BookACarDto bookACarDto) {
        Optional<Car> optionalCar = carRepository.findById(bookACarDto.getCarId());
        Optional<User> optionalUser = userRepository.findById(bookACarDto.getUserId());

        if (optionalCar.isPresent() && optionalUser.isPresent()) {
            Car existingCar = optionalCar.get();

            BookACar bookACar = new BookACar();
            bookACar.setUser(optionalUser.get());
            bookACar.setCar(existingCar);
            bookACar.setBookCarStatus(BookCarStatus.PENDING);

            // ✅ Set all values from DTO
            bookACar.setFromDate(bookACarDto.getFromDate());
            bookACar.setToDate(bookACarDto.getToDate());
            bookACar.setPickupLocation(bookACarDto.getPickupLocation());

            // ✅ Safer: backend calculates days and price
            long diffInMilliSeconds = bookACarDto.getToDate().getTime() - bookACarDto.getFromDate().getTime();
            long days = TimeUnit.MILLISECONDS.toDays(diffInMilliSeconds);
            if (days == 0) days = 1; // edge case: same day booking = 1 day

            bookACar.setDays(days);
            bookACar.setPrice(days * existingCar.getPrice());

            bookACarRepository.save(bookACar);
            return true;
        }

        return false;
    }


    @Override
    public CarDto getCarById(Long id) {
        Optional<Car> optionalCar = carRepository.findById(id);
        return optionalCar.map(Car::getCarDto).orElse(null);
    }

    @Override
    public List<BookACarDto> getBookingsByUserId(Long userId) {
        return bookACarRepository.findAllByUserId(userId).stream().map(BookACar::getBookACarDto).collect(Collectors.toList());
    }
    
    @Override
    public boolean cancelBooking(Long bookingId) {
        Optional<BookACar> optionalBooking = bookACarRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            BookACar booking = optionalBooking.get();
            booking.setBookCarStatus(BookCarStatus.CANCELLED); // ✅ Not REJECTED
            bookACarRepository.save(booking);
            return true;
        }
        return false;
    }
    
    @Override
    public CarDtoListDto searchCar(SearchCarDto searchCarDto) {
        Car car = new Car();
        car.setBrand(searchCarDto.getBrand());
        car.setType(searchCarDto.getType());
        car.setTransmission(searchCarDto.getTransmission());
        car.setColor(searchCarDto.getColor());

        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withMatcher("brand", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase()).withMatcher("type", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase()).withMatcher("transmission", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase()).withMatcher("color", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase());

        Example<Car> carExample = Example.of(car, exampleMatcher);

        List<Car> carList = carRepository.findAll(carExample);

        CarDtoListDto carDtoListDto = new CarDtoListDto();
        carDtoListDto.setCarDtoList(carList.stream().map(Car::getCarDto).collect(Collectors.toList()));

        return carDtoListDto;
    }

}

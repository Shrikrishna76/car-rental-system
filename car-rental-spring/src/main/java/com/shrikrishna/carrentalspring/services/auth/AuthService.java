package com.shrikrishna.carrentalspring.services.auth;

import com.shrikrishna.carrentalspring.dto.SignupRequest;
import com.shrikrishna.carrentalspring.dto.UserDto;

public interface AuthService {
    UserDto createCustomer(SignupRequest signupRequest);

    boolean hasCustomerWithEmail(String email);
}

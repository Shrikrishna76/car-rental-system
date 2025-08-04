package com.shrikrishna.carrentalspring.dto;

import com.shrikrishna.carrentalspring.enums.UserRole;

import lombok.Data;

@Data
public class AuthenticationResponse {
    private String jwt;
    private UserRole userRole;
    private Long userId;
    private String name;
}

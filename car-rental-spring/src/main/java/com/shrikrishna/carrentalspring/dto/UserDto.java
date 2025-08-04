package com.shrikrishna.carrentalspring.dto;

import com.shrikrishna.carrentalspring.enums.UserRole;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private UserRole userRole;
}

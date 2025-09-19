package com.mystore.user.service;

import com.mystore.user.dto.UserDto;
import com.mystore.user.model.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User createUser(User user);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
    UserDto convertToDto(User user);
    User convertToEntity(UserDto userDto);
}
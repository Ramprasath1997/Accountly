package ebank.userprofile.controller;

import ebank.userprofile.dto.UserResponse;
import ebank.userprofile.dto.UserUpdateRequest;
import ebank.userprofile.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    // =====================================================
    // GET LOGGED-IN USER PROFILE
    // =====================================================
    @GetMapping("/profile")
    public UserResponse getCurrentUser(
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        return authService.getCurrentUser(email);
    }

    // =====================================================
    // UPDATE LOGGED-IN USER PROFILE
    // =====================================================
    @PutMapping("/profile")
    public UserResponse updateCurrentUser(
            org.springframework.security.core.Authentication authentication,
            @RequestBody UserUpdateRequest request) {

        String email = authentication.getName();

        return authService.updateCurrentUser(email, request);
    }

    // =====================================================
    // DELETE LOGGED-IN USER ACCOUNT
    // =====================================================
    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteCurrentUser(
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        authService.deleteCurrentUser(email);

        return ResponseEntity.ok(
                Map.of("message", "Account deleted successfully")
        );
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================
    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {

        return authService.getAllUsers();
    }

    // =====================================================
    // UPDATE USER BY ID
    // =====================================================
    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request) {

        return authService.updateUser(id, request);
    }

    // =====================================================
    // CREATE USER
    // =====================================================
    @PostMapping("/users")
    public UserResponse createUser(
            @RequestBody UserUpdateRequest request) {

        return authService.createUser(request);
    }

    // =====================================================
    // DELETE USER BY ID
    // =====================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id) {

        authService.deleteUser(id);

        return ResponseEntity.ok(
                Map.of("message", "User deleted successfully")
        );
    }
}
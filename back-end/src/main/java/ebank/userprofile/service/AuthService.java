package ebank.userprofile.service;

import ebank.userprofile.dto.AuthResponse;
import ebank.userprofile.dto.LoginRequest;
import ebank.userprofile.dto.RegisterRequest;
import ebank.userprofile.dto.UserResponse;
import ebank.userprofile.dto.UserUpdateRequest;
import ebank.userprofile.entity.User;
import ebank.userprofile.repository.UserRepository;
import ebank.userprofile.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    // =====================================================
    // REGISTER
    // =====================================================
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setAccountBalance(BigDecimal.ZERO);

        userRepository.save(user);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(
                        user.getEmail()
                );

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }

    // =====================================================
    // LOGIN
    // =====================================================
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(
                        request.getEmail()
                );

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getAccountBalance()
                ))
                .toList();
    }

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================
    public UserResponse getCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return convertToUserResponse(user);
    }

    // =====================================================
    // UPDATE LOGGED-IN USER
    // =====================================================
    public UserResponse updateCurrentUser(
            String currentEmail,
            UserUpdateRequest request) {

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // ---------------------------------------------
        // UPDATE NAME
        // ---------------------------------------------
        if (request.getName() != null &&
                !request.getName().trim().isEmpty()) {

            user.setName(request.getName().trim());
        }

        // ---------------------------------------------
        // UPDATE EMAIL
        // ---------------------------------------------
        if (request.getEmail() != null &&
                !request.getEmail().trim().isEmpty()) {

            String newEmail = request.getEmail().trim();

            // Only check if email actually changed
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {

                if (userRepository.existsByEmail(newEmail)) {
                    throw new RuntimeException(
                            "Email is already registered"
                    );
                }

                user.setEmail(newEmail);
            }
        }

        // ---------------------------------------------
        // UPDATE PASSWORD
        // ---------------------------------------------
        if (request.getPassword() != null &&
                !request.getPassword().trim().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }

        // ---------------------------------------------
        // UPDATE ACCOUNT BALANCE
        // ---------------------------------------------
        if (request.getAccountBalance() != null) {

            if (request.getAccountBalance()
                    .compareTo(BigDecimal.ZERO) < 0) {

                throw new RuntimeException(
                        "Account balance cannot be negative"
                );
            }

            user.setAccountBalance(
                    request.getAccountBalance()
            );
        }

        User updatedUser = userRepository.save(user);

        return convertToUserResponse(updatedUser);
    }

    // =====================================================
    // DELETE LOGGED-IN USER
    // =====================================================
    public void deleteCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        userRepository.delete(user);
    }

    // =====================================================
    // UPDATE USER BY ID
    // =====================================================
    public UserResponse updateUser(
            Long id,
            UserUpdateRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        )
                );

        // Name
        if (request.getName() != null) {
            user.setName(request.getName().trim());
        }

        // Email
        if (request.getEmail() != null &&
                !request.getEmail().trim().isEmpty()) {

            String newEmail = request.getEmail().trim();

            if (!newEmail.equalsIgnoreCase(user.getEmail())) {

                if (userRepository.existsByEmail(newEmail)) {
                    throw new RuntimeException(
                            "Email is already registered"
                    );
                }

                user.setEmail(newEmail);
            }
        }

        // Password
        if (request.getPassword() != null &&
                !request.getPassword().trim().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }

        // Account balance
        if (request.getAccountBalance() != null) {

            if (request.getAccountBalance()
                    .compareTo(BigDecimal.ZERO) < 0) {

                throw new RuntimeException(
                        "Account balance cannot be negative"
                );
            }

            user.setAccountBalance(
                    request.getAccountBalance()
            );
        }

        /*
         * IMPORTANT:
         * If accountBalance is not supplied during an edit,
         * we keep the existing balance instead of setting it
         * to null.
         */

        User updatedUser = userRepository.save(user);

        return convertToUserResponse(updatedUser);
    }

    // =====================================================
    // CREATE USER
    // =====================================================
    public UserResponse createUser(
            UserUpdateRequest request) {

        if (userRepository.findByEmail(
                request.getEmail()
        ).isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // Never allow null account balance
        if (request.getAccountBalance() != null) {

            if (request.getAccountBalance()
                    .compareTo(BigDecimal.ZERO) < 0) {

                throw new RuntimeException(
                        "Account balance cannot be negative"
                );
            }

            user.setAccountBalance(
                    request.getAccountBalance()
            );

        } else {

            user.setAccountBalance(
                    BigDecimal.ZERO
            );
        }

        User savedUser = userRepository.save(user);

        return convertToUserResponse(savedUser);
    }

    // =====================================================
    // DELETE USER BY ID
    // =====================================================
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found with id: " + id
            );
        }

        userRepository.deleteById(id);
    }

    // =====================================================
    // CONVERT USER → USER RESPONSE
    // =====================================================
    private UserResponse convertToUserResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAccountBalance()
        );
    }
}
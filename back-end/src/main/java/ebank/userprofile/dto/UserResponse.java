package ebank.userprofile.dto;

import java.math.BigDecimal;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private BigDecimal accountBalance;

    public UserResponse() {
    }

    public UserResponse(
            Long id,
            String name,
            String email,
            BigDecimal accountBalance) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.accountBalance = accountBalance;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public BigDecimal getAccountBalance() {
        return accountBalance;
    }
}
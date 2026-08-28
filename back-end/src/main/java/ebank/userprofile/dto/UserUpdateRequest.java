package ebank.userprofile.dto;

import java.math.BigDecimal;

public class UserUpdateRequest {

    private String name;
    private String email;

    // Used when changing password
    private String currentPassword;
    private String password;

    private BigDecimal accountBalance;

    public UserUpdateRequest() {
    }

    // =========================
    // NAME
    // =========================
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // =========================
    // EMAIL
    // =========================
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // =========================
    // CURRENT PASSWORD
    // =========================
    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    // =========================
    // NEW PASSWORD
    // =========================
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // =========================
    // ACCOUNT BALANCE
    // =========================
    public BigDecimal getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(BigDecimal accountBalance) {
        this.accountBalance = accountBalance;
    }
}
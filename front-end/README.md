# Accountly

A full-stack User Management Application built using **React.js**, **Spring Boot**, **Spring Security**, **JWT Authentication**, and **MySQL**.

Accountly provides secure user authentication, registration, profile management, and complete CRUD operations for managing users through a responsive React frontend and RESTful Spring Boot backend.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Secure password handling
- Protected REST APIs
- JWT token validation
- Spring Security integration
- Authentication filter
- Logout functionality
- Authenticated user session handling

### 👥 User Management

The application provides complete CRUD functionality for managing users.

- Create users
- View all users
- View individual user details
- Update users
- Delete users
- User information validation
- Protected user management APIs

### 👤 Profile Management

Authenticated users can manage their personal profile information.

- View profile
- Update personal information
- Update user details
- Display logged-in user information
- Synchronize profile changes with the application

### 🖥️ Frontend

- React.js
- React Bootstrap
- Responsive UI
- Login page
- Registration page
- Home/Dashboard
- User Management
- Profile Management
- Form validation
- Loading states
- Error handling
- JWT token handling

### ⚙️ Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Maven
- RESTful APIs
- DTO-based request/response architecture
- Repository pattern
- Service layer
- Custom UserDetailsService
- JWT Authentication Filter

### 🗄️ Database

- MySQL
- Spring Data JPA
- Hibernate ORM
- Relational user data management

---

# 🏗️ Tech Stack

## Frontend

- React.js
- JavaScript
- React Bootstrap
- HTML5
- CSS3
- Axios / Fetch API
- JWT Decode

## Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven
- REST APIs

## Database

- MySQL

## Development Tools

- IntelliJ IDEA
- Visual Studio Code
- MySQL Workbench
- Git
- GitHub

---

# 📂 Project Structure

```text
Accountly/
│
├── front-end/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── User.jsx
│   │   │   └── UserForm.jsx
│   │   │
│   │   ├── App.js
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── package.json
│   └── ...
│
├── back-end/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── ebank/
│   │   │   │       └── userprofile/
│   │   │   │           │
│   │   │   │           ├── controller/
│   │   │   │           │   ├── AuthController.java
│   │   │   │           │   └── UserController.java
│   │   │   │           │
│   │   │   │           ├── dto/
│   │   │   │           │   ├── AuthResponse.java
│   │   │   │           │   ├── LoginRequest.java
│   │   │   │           │   ├── RegisterRequest.java
│   │   │   │           │   ├── UserResponse.java
│   │   │   │           │   └── UserUpdateRequest.java
│   │   │   │           │
│   │   │   │           ├── entity/
│   │   │   │           │   └── User.java
│   │   │   │           │
│   │   │   │           ├── repository/
│   │   │   │           │   └── UserRepository.java
│   │   │   │           │
│   │   │   │           ├── security/
│   │   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │   │           │   ├── JwtService.java
│   │   │   │           │   └── SecurityConfig.java
│   │   │   │           │
│   │   │   │           └── service/
│   │   │   │               ├── AuthService.java
│   │   │   │               └── CustomUserDetailsService.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
└── README.md

                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               │ HTTP Requests
                               ▼
                    ┌──────────────────────┐
                    │     Spring Boot      │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
                  ▼            ▼            ▼
             Controller     Service     Security
                  │            │            │
                  └────────────┼────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Spring Data JPA    │
                    │      Hibernate       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │        MySQL         │
                    │       Database       │
                    └──────────────────────┘



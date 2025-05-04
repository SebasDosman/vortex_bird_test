# Movie Ticket Web App — VortexBird Technical Test

This repository contains both the **front-end** and **back-end** of a web application developed as a technical test for **VortexBird**. The application allows users to explore and purchase movie tickets online and includes administrative functionalities for managing movies and clients.

## Tech Stack

### Front-End
- [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for styling

### Back-End
- [Spring Boot](https://spring.io/projects/spring-boot) (REST API)
- Role-Based Access Control (RBAC) with Spring Security
- File storage system for uploading and serving movie images
- Email service for purchase confirmations


## Functional Scope

### Public Access
- View the list of available movies.
- Search for movies using filters.

### Customer Registration
- Users can register by providing:
  - Email
  - Phone number
  - First name
  - Last name
  - Password

### Ticket Purchase (Registered Users Only)
- Search for movies.
- Select the number of tickets.
- Enter basic payment information.
- Receive confirmation via email.

### Movie Management (Admin Module)
- Create, read, update, and disable movies.
- Upload and manage movie images.

### Client Management (Admin Module)
- View and disable client accounts.

### Purchase History (Admin Module)
- View movie purchases made by users.


## Security

All administrative and purchase-related operations are protected using **RBAC (Role-Based Access Control)** via Spring Security. Only authorized users can access sensitive endpoints.


## Getting Started

### Prerequisites
- Node.js and npm
- Java 21+
- Maven
- PostgreSQL

### Run Front-End
```bash
cd film-management-front
npm install
npm run dev
```

### Run Back-End
```bash
cd film-management-back
./mvnw spring-boot:run
```

## Contact
For any questions regarding the test or the implementation, feel free to reach out.

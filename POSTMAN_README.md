# Book Store API Postman Collection

This repository contains a Postman collection for testing and interacting with the Book Store API.

## Table of Contents

- [Getting Started](#getting-started)
- [Importing the Collection](#importing-the-collection)
- [Environment Setup](#environment-setup)
- [Available Endpoints](#available-endpoints)
- [Authentication](#authentication)
- [Testing Flow](#testing-flow)

## Getting Started

Before using this collection, make sure you have:

1. Installed [Postman](https://www.postman.com/downloads/)
2. The Book Store API server running locally (default: http://localhost:5000)

## Importing the Collection

1. Open Postman
2. Click on "Import" button
3. Select the `Book_Store_API_Postman_Collection.json` file
4. Click "Import"

## Environment Setup

1. Import the `Book_Store_Environment.json` file into Postman
2. Select the "Book Store Environment" from the environment dropdown
3. The environment contains the following variables:
   - `base_url`: The base URL for the API (default: http://localhost:5000)
   - `token`: Will be automatically set after successful login
   - Various IDs for testing

## Available Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login with existing credentials

### Books

- **GET /api/books** - Get all books
- **GET /api/books?minPrice=X&maxPrice=Y** - Get books filtered by price
- **GET /api/books/:id** - Get a book by ID
- **POST /api/books/newBook** - Create a new book (Admin only)
- **PUT /api/books/updateBook/:id** - Update a book (Admin only)
- **DELETE /api/books/deleteBook/:id** - Delete a book (Admin only)

### Authors

- **GET /api/authors** - Get all authors
- **GET /api/authors?page=X&limit=Y** - Get authors with pagination
- **GET /api/authors/:id** - Get an author by ID
- **POST /api/authors/newAuthor** - Create a new author (Admin only)
- **PUT /api/authors/:id** - Update an author (Admin only)
- **DELETE /api/authors/:id** - Delete an author (Admin only)

### Users

- **GET /api/users** - Get all users (Admin only)
- **GET /api/users/:id** - Get a user by ID (Admin or self)
- **PUT /api/users/updateUser/:id** - Update a user (Admin or self)
- **DELETE /api/users/:id** - Delete a user (Admin or self)

## Authentication

Many endpoints require authentication with a valid JWT token. The collection automatically saves the token from login responses. To authenticate:

1. Use the "Register" request to create a new user or "Login" with existing credentials
2. The token will be automatically stored in the environment variable
3. All subsequent requests that require authentication will use this token

## Testing Flow

Suggested testing flow:

1. Register a new user
2. Login with the registered user
3. Create an author (requires admin rights)
4. Create a book using the created author's ID
5. Test various GET, PUT, DELETE operations

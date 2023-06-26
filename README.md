# Project - Books Management:

## Description
The Book Management project is a server-side application designed to streamline the process of managing books and their associated information. The project provides a user-friendly interface that allows users to register, login, and perform various operations related to books. Users can create new books, update existing book details, retrieve book information, and delete books if necessary. Additionally, the application allows users to write reviews for books and view reviews submitted by other users. The project ensures data security by implementing user authentication and authorization mechanisms. With the Book Management project, users can efficiently organize, track, and review books, making it a valuable tool for book enthusiasts, libraries, and bookstores.

## Technologies
* Node.js
* Express.js
* MongoDB
* JavaScript
* JSON Web Token
* Validator

## Development Link - 
https://book-management-yqjo.onrender.com
## Models

The following models are used in this project:

* **User**
  * `title`: The user's title (Mr, Mrs, Miss)
  * `name`: The user's name
  * `phone`: The user's phone number
  * `email`: The user's email address
  * `password`: The user's password
  * `address`: The user's address
  * `createdAt`: The date and time the user was created
  * `updatedAt`: The date and time the user was last updated

* **Books**
  * `title`: The title of the book
  * `excerpt`: A short summary of the book
  * `userId`: The ID of the user who created the book
  * `ISBN`: The ISBN of the book
  * `category`: The category of the book
  * `subcategory`: The subcategory of the book
  * `reviews`: The number of reviews for the book
  * `deletedAt`: The date and time the book was deleted
  * `isDeleted`: Whether the book is deleted
  * `releasedAt`: The date and time the book was released
  * `createdAt`: The date and time the book was created
  * `updatedAt`: The date and time the book was last updated

* **Review**
  * `bookId`: The ID of the book that the review is for
  * `reviewedBy`: The name of the person who wrote the review
  * `reviewedAt`: The date and time the review was written
  * `rating`: The rating of the book (1-5 stars)
  * `review`: The text of the review
  * `isDeleted`: Whether the review is deleted

## User APIs

The following APIs are available for users:

* **POST /register**
  * Creates a new user.
  * Returns the newly created user.

* **POST /login**
  * Logs in a user.
  * Returns a JWT token that can be used to authenticate future requests.

## Books APIs

The following APIs are available for books:

* **POST /books**
  * Creates a new book.
  * Returns the newly created book.

* **GET /books**
  * Returns a list of all books.

* **GET /books/:bookId**
  * Returns a specific book.

* **PUT /books/:bookId**
  * Updates a specific book.

* **DELETE /books/:bookId**
  * Deletes a specific book.

## Review APIs
* **POST /books/:bookId/review**
  * Creates a new review for a book.
  * Returns the book with the review included.

* **PUT /books/:bookId/review/:reviewId**
  * Updates a review for a book.
  * Returns the book with the review included.

* **DELETE /books/:bookId/review/:reviewId**
  * Deletes a review for a book.
  * Returns the book with the review excluded.

## Authentication

All book APIs require authentication. The JWT token that is returned from the `POST /login` endpoint can be used to authenticate future requests.

## Authorizations

Only the owner of a book can create, edit, or delete the book. If a user attempts to perform an unauthorized action, they will receive an error message.

## Error Responses

The following error responses are returned by the APIs:

* **400 Bad Request**
  * The request was malformed.
* **401 Unauthorized**
  * The user is not authorized to perform the requested action.
* **404 Not Found**
  * The resource was not found.
* **500 Internal Server Error**
  * An unexpected error occurred.

## Successful Responses

The following successful responses are returned by the APIs:

* **200 OK**
  * The request was successful.
* **201 Created**
  * The resource was created successfully.

I hope this documentation is helpful. Please let me know if you have any questions.

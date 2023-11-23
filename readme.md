# Phonebook REST API


## Structure:
- **/controllers** - Handles requests, interacts with models, and sends responses.
- **/helpers** - Contains utility/helper functions used across different parts of the application, aiding in various functionalities.
- **/middlewares** - Contains middleware functions (e.g., authentication middleware).
- **/models** - Defines database schemas and interacts with the database.
- **/public** - Serves as a temporary storage directory for user avatars before they're uploaded to the database. It temporarily holds user avatar images during the upload process.
- **/routes** - Defines API endpoints and routes.
- **/tmp** - Another temporary storage directory used by the application for file uploads or other transient data. It may also be utilized for handling temporary data or file manipulation before final processing or storage.
- **/utils** - Contains various utility functions or modules that provide generic functionalities throughout the application.
- **Dockerfile** - Configuration file containing instructions for building a Docker image for the application.
- **app.js** - Entry point of the application, sets up server and middleware.
- **env.example** - Example file showing the structure and keys of environment variables required by the application.
- **nodemon.json** - Configuration file for Nodemon, a utility that monitors changes in the application and automatically restarts the server during development.
- **package.json** - Contains project metadata and dependencies.
- **README.md** - Provides instructions for setting up and running the application.
- **server.js** - Server setup file, handling server configurations or starting the application.

## Functionality:

### Authentication:
- User registration, login, and logout endpoints.
- Middleware for authentication and authorization.

### Contacts Management:
- API endpoints for CRUD operations on contacts.
- Endpoints to retrieve, add, update, and delete contacts.
- Database models to manage contacts.

## Technologies Used:
- Node.js and Express for the backend.
- Database MongoDB for storing contact information.
- Authentication using JSON Web Tokens (JWT).
- Jest for unit testing of login controller.


## Development Workflow:

### Setup:
Clone the repository.  
Install dependencies using `npm install`.

### Run Application:
Use `npm start` to start the server.  
Or use `npm run start:dev` to start the server in development mode.

### Testing:
Run tests using `npm run test`.

## Usage:

### API Endpoints:
- Register a new user: **POST** `/api/users/register`
  ```bash
  {
    "email": "email@example.com",
    "password": "PasswordExample"
  }
  ```
- Verify email address: **GET** `/api/users/verify/:verificationToken`
- Request email address verification: **POST** `/api/users/verify`
  ```bash
  {
    "email": "email@example.com"
  }
  ```
- Log in a user: **POST** `/api/users/login`
  ```bash
  {
    "email": "email@example.com",
    "password": "PasswordExample"
  }
  ```
- Log out a user: **POST** `/api/users/logout` 🔓*
- Get current user: **GET** `/api/users/current` 🔓*
- Update subscription status: **PATCH** `/api/users` 🔓*
  ```bash
  {
    "subscription": "business",
  }
  ```
- Update user's avatar: **PATCH** `/api/users/avatars` 🔓*
  ```bash
  "Content-Type": "multipart/form-data",
  "body": {
    "avatar": {binary string},
  }
  ```
- Get all contacts: **GET** `/api/contacts` 🔓*
- Get contact by ID: **GET** `/api/contacts/:contactId` 🔓*
- Add a contact: **POST** `/api/contacts` 🔓*
  ```bash
  {
    "name": "Name Example",
    "email": "email@example.com",
    "phone": "123-456-7890"
  }
  ```
- Delete a contact: **DELETE** `/api/contacts/:contactId` 🔓*
- Update a contact: **PUT** `/api/contacts/:contactId` 🔓*
  ```bash
  {
    "name": "Name Example",
    "email": "email@example.com",
    "phone": "123-456-7890"
  }
  ```
- Update 'Favorite' status to contact: **PATCH** `/api/contacts/:contactId/favorite` 🔓*
  ```bash
  {
    "favorite": true
  }
  ```

🔓* - Private route. `"authorization": "Bearer {token}"` required.

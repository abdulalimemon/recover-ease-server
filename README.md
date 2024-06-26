<h1 align="center">Recover Ease Server</h1>

<p align=center>
  <a href="https://recover-ease.netlify.app/">Website Link</a> ·
  <a href="https://github.com/abdulalimemon/recover-ease">Frontend repository link</a> ·
  <a href="https://github.com/abdulalimemon/recover-ease-server">Backend repository link</a>
</p>

## Installation:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the server using `npm run dev`.


## Configuration:

- Environment Variables:
  - `PORT`: Port number the server listens on. Default: 3000
  - `MONGODB_URI`: URI for MongoDB database.
  - `JWT_SECRET`: Secret key for JWT token generation.
  - `EXPIRES_IN`: Token expiration time.

## Tech Stack

- Node js
- Express js
- Mongodb

## Dependencies:

- `bcrypt`: Library for hashing passwords.
- `cors`: Express middleware for enabling CORS.
- `dotenv`: Loads environment variables from .env file.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: Library for generating and verifying JWT tokens.
- `mongodb`: MongoDB driver for Node.js.
- `nodemon`: Utility for automatically restarting the server during development.
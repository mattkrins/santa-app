# Santa's Wishlist WebApp

A simple web application that allows children to submit their wishes to Santa Claus. The app ensures that only registered children under the age of 10 can submit their wishes, and it sends the wishes to Santa every 15 seconds via email.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

## Features

- **Child Registration Verification:** Checks if the child is registered in the system.
- **Age Verification:** Ensures the child is less than 10 years old before accepting their wish.
- **Error Handling:** Displays appropriate error messages if the child is not registered or too old.
- **Wish Submission:** Successfully registered and eligible children can submit their wishes to Santa.
- **Automated Email Sending:** Every 15 seconds, the server sends an email to Santa with all pending wishes.

## Prerequisites

- Node.js (v20 or later)
- npm (v10 or later)
- [Ethereal Email Account](https://ethereal.email) for testing email sending

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mattkrins/santa-app.git
   cd santas-wishlist
   ```

2. Install the required dependencies:
   `npm install`
3. Set up the environment variables:
   ```
   MAIL_USER=your_ethereal_username
   MAIL_PASS=your_ethereal_password
   # Optional
   MAIL_HOST=smtp.ethereal.email
   MAIL_PORT=587
   MAIL_DELAY=15000
   MAIL_FROM=do_not_reply@northpole.com
   MAIL_TO=santa@northpole.com
   ```

## Usage

### Development

1.  Start the development server: `npm dev`
    This will run both the client and server in watch mode, allowing you to see changes in real-time.
    - Client Development: The client is developed using React and Vite, using TypeScript
    - Server Development: The server is built with Node.js and Express, using TypeScript.
2.  Open your web browser and go to **http://localhost:3001**.

### Production

1.  Build the application: `npm build`
    The application is built into **/dist** folder.
2.  Start the server: `npm start`
    The Express server serves the built application from **/dist/server/server.js**.
3.  Open your web browser and go to **http://localhost:3000**.

### Testing

This project uses Vitest for testing. To run the test: `npm test`\
[ethereal.mail](https://ethereal.email) will be used to test the mailer service. A username and password will be generated and printed to the console.

## Configuration

### SMTP Configuration:

The server uses Ethereal Email for sending emails by default, which is great for testing.\ You can replace it with any SMTP service by updating the .env file.

### Email Sending Interval:

The interval for sending emails can be modified in the server configuration (default is 15 seconds).

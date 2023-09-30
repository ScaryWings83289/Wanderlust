# Wanderlust - Full-Stack Traveling Website

![Made-With-NodeJS](https://img.shields.io/badge/Made_with-NodeJS-informational?style=for-the-badge&logo=javascript)
![Made-With-ExpressJS](https://img.shields.io/badge/Made_with-ExpressJS-informational?style=for-the-badge&logo=express)
![Made-With-MongoDB](https://img.shields.io/badge/Made_with-MongoDB-informational?style=for-the-badge&logo=mongodb)
![Made-With-Bootstrap](https://img.shields.io/badge/Made_with-Bootstrap-informational?style=for-the-badge&logo=bootstrap)

This is a full-stack traveling website developed using Node.js, MongoDB, Mongoose, Express, Passport for authentication, Cloudinary for image storage, nodemailer for sending email to a user, HTML, CSS, and Bootstrap for the frontend. The website allows users to explore travel destinations, create accounts, and share their travel experiences.


## Quick Start

Clone the repository and do following:

1. Clone the repository:
```bash
git clone https://github.com/ScaryWings83289/Wanderlust.git
cd Wanderlust
```

2. Install dependencies:
```bash
# Install dependencies for server
npm install
```

3. Configure environment variables (e.g., MongoDB URI, Cloudinary credentials) in a .env file.

4. Start the server:
```bash
# Run the client 
nodemon app.js
```

5. Access the website by navigating to http://localhost:3000 in your web browser.


## Usage
The website allows users to:

- Explore travel destinations with descriptions and images.
- Create accounts and log in.
- Share their travel experiences by creating tours.
- Comment on travel experiences.
- Edit and delete their own tours.
- Browse posts from other users.


## Features

Here are some key features of the website:

### Front-End
* Responsive design using Bootstrap and custom CSS.
* Tours Page containing a map consisting of geographical location of all tours, search bar to search a particular tour & list of 4 tours on a single page.
* User-friendly interfaces for posting and interacting with travel experiences.
* Different tours and their reviews.


### Backend
* User registration and authentication with Passport.
* Secure image storage and management using Cloudinary.
* REST APIs for routing between different pages.
* Only authenticated and authorised user can perform CRUD operations.
* Admin role with certain privileges.

**SCREENSHOTS:**

Landing Page:

![](assets/main-screen.jpg)

Tours Preview:

![](assets/preview-page.jpg)

Sign-in && Sign-Up Page:

![](assets/signinup.jpg)

Individual Tour Section:

![](assets/cart.jpg)


## Developed With

* [Visual Studio Code](https://code.visualstudio.com/) - A source code editor developed by Microsoft for Windows, Linux and macOS. It includes support for debugging, embedded Git control, syntax highlighting, intelligent code completion, snippets, and code refactoring
* [NodeJS](https://nodejs.org/en/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
* [MongoDB](https://www.mongodb.com/) - A general purpose, document-based, distributed database built for modern application developers and for the cloud
* [Cloudinary](https://cloudinary.com/) - Cloudinary’s mission is to help companies unleash the full potential of their media to create the most engaging visual experiences.
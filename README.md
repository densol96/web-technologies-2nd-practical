# Anime Movie Discussion Platform

This is a full-stack web application designed as an online platform for discussing movies in the style of anime. The platform includes a range of features such as user registration and authentication, role-based authorization, content management, and more.

## Features

### Authentication & Security:
- **User Registration & Authentication**:  
  - Secure user registration with password hashing.  
  - Email verification system to validate user accounts.  
  - JWT-based authentication for session handling.  
  - Role-based access control with two roles: Regular Users and Administrators.  

- **Advanced Security Measures**:  
  - Auto-locking system after a certain number of failed login attempts.  
  - User ban functionality, managed by administrators.  
  - Password recovery system using email-based tokens.  

### Content Management System (CMS):
- Admin panel for managing:
  - Articles and content creation.  
  - User accounts (including bans and permissions).  
  - Comments moderation.  

### User Interaction:
- **Discussions and Comments**:  
  - Add and manage articles related to movies.  
  - Commenting system for discussions.  

- **Chat**:  
  - Built-in chat system for interactions among users.  

### Front-End:
- Server-side rendering of HTML pages using **Pug** templates.  
- Fully dynamic pages with interactive elements powered by vanilla JavaScript.

## Technologies Used

### Back-End:
- **Node.js**: Application runtime environment.
- **Express.js**: Web framework for building the server-side API and rendering pages.
- **Mongoose**: ODM library for MongoDB, used for managing database schemas and queries.

### Front-End:
- **Pug**: Template engine used on the server for generating and delivering complete HTML pages.  
- **Vanilla JavaScript**: Used for client-side interactivity (e.g., form validations, modals).

### Database:
- **MongoDB**: NoSQL database for storing user data, articles, comments, and chat messages.

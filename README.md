# WasteZero

WasteZero is a full-stack web application designed to connect NGOs, volunteers, and administrators to manage waste collection drives, recycling initiatives, and volunteer opportunities. The platform streamlines opportunity management, volunteer participation, user communication, and administrative monitoring through a secure and user-friendly interface.
<hr>

# Tech Stack

### Frontend
- Angular
- TypeScript
- HTML5
- CSS3
- Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Multer
- Cloudinary
- Nodemailer
<hr>

# Features

- User Registration & Login
- JWT Authentication
- Role-Based Access Control (Admin, NGO, Volunteer)
- Dashboard Management
- User Profile Management
- Opportunity Management
- Volunteer Applications
- Messaging System
- Image Uploads
- Responsive User Interface

<hr>

# Prerequisites

Before setting up the project, ensure the following software and services are available:

- Node.js (v18 or later)
- npm
- Git
- MongoDB Atlas Account
- Cloudinary Account
- Gmail Account with App Password
- Angular CLI

Verify installations:

```bash
node -v
npm -v
ng version
```
<hr>

# Project Structure

```
WasteZero/
│
├── frontend/
│   ├── src/
│   ├── assets/
│   ├── angular.json
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── .env.example
└── README.md
``` 

<hr>

# Installation

## 1. Clone the Repository

```bash
git clone <repository-url>

cd WasteZero
```
## 2. Backend Setup

Navigate to the backend folder.

```bash
cd backend
```
Install dependencies.

```bash
npm install
```
Create a `.env` file using the `.env.example` file.

Start the backend server.

```bash
npm run dev
```
The backend will run on:

```
http://localhost:5000
```
## 3. Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
```
Install dependencies.

```bash
npm install
```
Run the Angular application.

```bash
ng serve
```
The frontend will run on:

```
http://localhost:4200
```
<hr>

# Environment Variables

Create a `.env` file inside the backend folder and configure the following variables.
<table>
<tr>
<th> Variable </th><th>Description</th>
</tr>
<tr>
<td>PORT</td><td>Backend server port</td>
</tr>
<tr>
<td>MONGO_URI</td><td>MongoDB Atlas connection string</td>
</tr>
<tr>
<td>JWT_SECRET</td><td>Secret key used to generate JWT tokens</td>
</tr>
<tr>
<td>CLOUDINARY_CLOUD_NAME</td><td>Cloudinary cloud name</td>
</tr>
<tr>
<td>CLOUDINARY_API_KEY</td><td>Cloudinary API key</td>
</tr>
<tr>
<td>CLOUDINARY_API_SECRET</td><td>Cloudinary API secret</td>
</tr>
<tr>
<td> EMAIL_USER</td><td>Gmail email address</td>
</tr>
<tr>
<td>EMAIL_PASS</td><td>Gmail App Password</td>
</tr>
</table>

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=example@gmail.com

EMAIL_PASS=your_app_password
```
<hr>

# API Documentation

The backend exposes RESTful APIs that enable communication between the Angular frontend and the Express backend.

## Authentication
<table>
<tr><th>Method</th><th>Endpoint</th><th>Authentication</th>
</tr>
<tr>
<td>POST</td><td>/api/auth/register</td><td>No</td>
</tr>
<tr>
<td>POST</td><td>/api/auth/login</td><td>No</td>
</tr>
<tr>
<td>POST</td><td>/api/auth/forgot-password</td><td>No</td>
</tr>
</table>

### Description

Handles user registration, login, and password recovery.

<hr>

## Users
<table>
<tr><th>Method</th><th>Endpoint</th><th>Authentication</th>
</tr>
<tr>
<td>GET</td><td>/api/users/profile</td><td>Yes</td>
</tr>
<tr>
<td>PUT</td><td>/api/users/profile</td><td>Yes</td>
</tr>
</table>

### Description

Retrieves and updates authenticated user profile information.

<hr>

## Opportunities
<table>
<tr><th>Method</th><th>Endpoint</th><th>Authentication</th>
</tr>
<tr>
<td>GET</td><td>/api/opportunities</td><td>Public</td>
</tr>
<tr>
<td>GET</td><td>/api/opportunities/:id</td><td>Public</td>
</tr>
<tr>
<td>POST</td><td>/api/opportunities</td><td>NGO/Admin</td>
</tr>
<tr>
<td>PUT</td><td>/api/opportunities/:id</td><td>NGO/Admin</td>
</tr>
<tr>
<td>DELETE</td><td>/api/opportunities/:id</td><td>NGO/Admin</td>
</tr>
</table>

### Description

Allows administrators and NGOs to create and manage volunteer opportunities while allowing volunteers to browse available opportunities.

<hr>

## Applications

<table>
<tr><th>Method</th><th>Endpoint</th><th>Authentication</th>
</tr>
<tr>
<td> POST</td><td>/api/applications</td><td>Volunteer</td>
</tr>
<tr>
<td> GET</td><td>/api/applications</td><td>NGO/Admin</td>
</tr>
</table>

### Description

Allows volunteers to apply for opportunities and enables NGOs or administrators to manage submitted applications.

<hr>

## Messages

<table>
<tr><th>Method</th><th>Endpoint</th><th>Authentication</th>
</tr>
<tr>
<td> GET</td><td>/api/messages</td><td>Yes</td>
</tr>
<tr>
<td> POST</td><td>/api/messages</td><td>Yes</td>
</tr>
</table>

### Description

Supports secure communication between users within the platform.

<hr>

# Architecture Overview

WasteZero follows a client-server architecture.

```
Angular Frontend
        │
        │ REST API
        ▼
Express.js Backend
        │
        ▼
MongoDB Atlas
        │
        ▼
Cloudinary (Image Storage)
```

### Workflow

1. Users interact with the Angular frontend.
2. Frontend sends REST API requests to the Express backend.
3. Backend validates requests using JWT authentication.
4. Data is stored and retrieved from MongoDB Atlas.
5. Images are uploaded to Cloudinary.
6. Responses are sent back to the frontend for display.

<hr>

# Running the Project

## Start Backend

```bash
cd backend

npm run dev
```

---

## Start Frontend

```bash
cd frontend

ng serve
```

Visit:

```
http://localhost:4200
```

<hr>

# Testing

Run backend tests.

```bash
npm test
```

Run Angular unit tests.

```bash
ng test
```

Build the Angular project.

```bash
ng build
```

<hr>

# Deployment

---soon---

<hr>

# Contribution Guidelines

Contributions are welcome.

1. Fork the repository.

2. Create a new feature branch.

```bash
git checkout -b feature-name
```

3. Make your changes.

4. Commit your work.

```bash
git commit -m "Add feature"
```

5. Push the branch.

```bash
git push origin feature-name
```

6. Open a Pull Request for review.

Please ensure your code follows the project's coding standards and is tested before submission.

<hr>

# Authors

Developed by the WasteZero Development Team.
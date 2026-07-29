# WasteZero Complete Source Code

This document contains the readable application source and configuration.
Dependencies, lock files, media, secrets, caches, and generated output are excluded.

Included files: 115

## README.md

~~~markdown
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
- Real-time NGO/volunteer messaging with Socket.IO
- Volunteer matching by waste type, skills, and location
- In-app application and message notifications
- Household pickup scheduling with role-based status management
- Image Uploads
- Responsive User Interface

<hr>

# Prerequisites

Before setting up the project, ensure the following software and services are available:

- Node.js (v18 or later)
- npm
- Git
- MongoDB Community Server (MongoDB Compass is optional)
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
Create a `.env` file using the `.env.example` file. For local MongoDB/Compass use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/wastezero
JWT_SECRET=replace-with-a-long-random-secret
```

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

## Pickups

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/pickups` | Authenticated |
| POST | `/api/pickups` | Volunteer |
| PATCH | `/api/pickups/:id/status` | NGO/Admin |
| PATCH | `/api/pickups/:id/cancel` | Volunteer owner |

Volunteers can schedule and track waste pickups. NGOs and administrators can
confirm, assign, progress, complete, or cancel pickup requests. Each status
change creates an in-app notification for the volunteer.

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

The backend health endpoint is available at `http://localhost:5000`.

To inspect the local database in MongoDB Compass, connect with:

```text
mongodb://127.0.0.1:27017
```

Then open the `wastezero` database.

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
~~~
## backend/.env.example

~~~text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/wastezero
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
EMAIL_USER=
EMAIL_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
~~~
## backend/.gitignore

~~~text
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage
coverage/

# Build folders
dist/
build/

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/

# Temporary files
*.tmp
*.temp

# Optional npm cache
.npm
.npm-cache/

# Optional ESLint cache
.eslintcache
~~~
## backend/config/cloudinary.js

~~~javascript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
~~~
## backend/config/db.js

~~~javascript
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
~~~
## backend/config/env.js

~~~javascript
import dotenv from 'dotenv';
dotenv.config();
~~~
## backend/controller/authController.js

~~~javascript
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { isDisposableEmail, verifyEmailOtp } from './otpController.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Only these roles are self-service at signup. Admin accounts are never
// created through the public registration form.
const REGISTERABLE_ROLES = ['volunteer', 'ngo'];

const registerUser = async (req, res) => {
  const { name, email, password, location, skills, waste_types, bio, role, otp } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (isDisposableEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Temporary or disposable email addresses are not allowed. Please use a real email address.' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    if (!otp) {
      return res.status(400).json({ message: 'Email verification OTP is required. Please verify your email first.' });
    }

    const otpCheck = await verifyEmailOtp(normalizedEmail, otp);
    if (!otpCheck.valid) {
      return res.status(400).json({ message: otpCheck.message });
    }

    const safeRole = REGISTERABLE_ROLES.includes(role) ? role : 'volunteer';

    const user = await User.create({
      name, email: normalizedEmail, password,
      role: safeRole,
      location: location || '',
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
      waste_types: waste_types
        ? (Array.isArray(waste_types) ? waste_types : waste_types.split(',').map(s => s.trim()))
        : [],
      bio: bio || '',
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, location: user.location, skills: user.skills, waste_types: user.waste_types, bio: user.bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, location: user.location, skills: user.skills, waste_types: user.waste_types, bio: user.bio,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.skills = req.body.skills || user.skills;
      user.waste_types = req.body.waste_types || user.waste_types;
      if (req.body.password) user.password = req.body.password;
      const updated = await user.save();
      res.json({
        _id: updated._id, name: updated.name, email: updated.email,
        role: updated.role, location: updated.location, skills: updated.skills, waste_types: updated.waste_types, bio: updated.bio,
        token: generateToken(updated._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export{ registerUser, loginUser, getUserProfile, updateUserProfile };
~~~
## backend/controller/matchingController.js

~~~javascript
import Opportunity from '../models/Opportunity.js';

const normalize = (value) => String(value || '').trim().toLowerCase();

const scoreOpportunity = (opportunity, user) => {
  const userSkills = new Set((user.skills || []).map(normalize).filter(Boolean));
  const preferredWasteTypes = new Set((user.waste_types || []).map(normalize).filter(Boolean));
  const opportunitySkills = (opportunity.required_skills || []).map(normalize).filter(Boolean);
  const opportunityWasteTypes = (opportunity.waste_types || []).map(normalize).filter(Boolean);

  const matchedSkills = opportunitySkills.filter((skill) => userSkills.has(skill));
  const matchedWasteTypes = opportunityWasteTypes.filter((type) => preferredWasteTypes.has(type));
  const sameLocation =
    Boolean(normalize(user.location)) &&
    (normalize(opportunity.location).includes(normalize(user.location)) ||
      normalize(user.location).includes(normalize(opportunity.location)));

  let score = 0;
  if (opportunitySkills.length) score += (matchedSkills.length / opportunitySkills.length) * 45;
  if (opportunityWasteTypes.length) {
    score += (matchedWasteTypes.length / opportunityWasteTypes.length) * 35;
  } else if (matchedSkills.length) {
    score += 15;
  }
  if (sameLocation) score += 20;

  return {
    opportunity,
    score: Math.round(Math.min(score, 100)),
    reasons: [
      ...(sameLocation ? [`Near ${user.location}`] : []),
      ...(matchedWasteTypes.length ? [`Waste: ${matchedWasteTypes.join(', ')}`] : []),
      ...(matchedSkills.length ? [`Skills: ${matchedSkills.join(', ')}`] : []),
    ],
  };
};

const getMatchSuggestions = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Match suggestions are available to volunteers' });
    }

    const opportunities = await Opportunity.find({ status: 'open' })
      .populate('ngo_id', 'name email')
      .sort({ createdAt: -1 });

    const matches = opportunities
      .map((opportunity) => scoreOpportunity(opportunity, req.user))
      .sort((a, b) => b.score - a.score || b.opportunity.createdAt - a.opportunity.createdAt);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getMatchSuggestions };
~~~
## backend/controller/messageController.js

~~~javascript
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const getContacts = async (req, res) => {
  try {
    const contacts = await User.find({
      _id: { $ne: req.user._id },
      role: req.user.role === 'volunteer' ? { $in: ['ngo', 'admin'] } : 'volunteer',
    })
      .select('name email role location')
      .sort({ name: 1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const otherUser = await User.findById(req.params.userId).select('name email role location');
    if (!otherUser) return res.status(404).json({ message: 'Contact not found' });

    const messages = await Message.find({
      $or: [
        { sender_id: req.user._id, recipient_id: otherUser._id },
        { sender_id: otherUser._id, recipient_id: req.user._id },
      ],
    })
      .populate('sender_id', 'name email role')
      .populate('recipient_id', 'name email role')
      .populate('opportunity_id', 'title')
      .sort({ createdAt: 1 })
      .limit(250);

    await Message.updateMany(
      { sender_id: otherUser._id, recipient_id: req.user._id, read_at: null },
      { $set: { read_at: new Date() } },
    );

    res.json({ contact: otherUser, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const content = req.body.content?.trim();
    if (!content) return res.status(400).json({ message: 'Message cannot be empty' });

    const recipient = await User.findById(req.params.userId).select('name');
    if (!recipient) return res.status(404).json({ message: 'Contact not found' });
    if (recipient._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'You cannot message yourself' });
    }

    const message = await Message.create({
      sender_id: req.user._id,
      recipient_id: recipient._id,
      opportunity_id: req.body.opportunity_id || null,
      content,
    });

    await message.populate('sender_id', 'name email role');
    await message.populate('recipient_id', 'name email role');

    await Notification.create({
      user_id: recipient._id,
      type: 'message',
      title: `New message from ${req.user.name}`,
      message: content.length > 100 ? `${content.slice(0, 97)}...` : content,
      link: `/messages?contact=${req.user._id}`,
    });

    req.app.get('io')?.to(`user:${recipient._id}`).emit('message:new', message);
    req.app.get('io')?.to(`user:${recipient._id}`).emit('notification:new');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createMessage, getContacts, getConversation };
~~~
## backend/controller/notificationController.js

~~~javascript
import Notification from '../models/Notification.js';

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    const unread = notifications.filter((notification) => !notification.read_at).length;
    res.json({ notifications, unread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { read_at: new Date() },
      { new: true },
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user._id, read_at: null },
      { $set: { read_at: new Date() } },
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getNotifications, markAllNotificationsRead, markNotificationRead };
~~~
## backend/controller/opportunityController.js

~~~javascript
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "opportunities",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const fileToDataUrl = (file) => {
  if (!file) return "";
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

const getOpportunityImageUrl = async (file) => {
  if (!file) return "";

  if (hasCloudinaryConfig()) {
    try {
      const uploaded = await uploadToCloudinary(file.buffer);
      return uploaded.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error.message);
    }
  }

  return fileToDataUrl(file);
};

const canManageOpportunity = (opportunity, user) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  const ngoId = opportunity.ngo_id?._id || opportunity.ngo_id;
  return ngoId.toString() === user._id.toString();
};

const isOpportunityOwner = (opportunity, user) => {
  if (!user || user.role !== "ngo") return false;
  const ngoId = opportunity.ngo_id?._id || opportunity.ngo_id;
  return ngoId.toString() === user._id.toString();
};

const createOpportunity = async (req, res) => {
  const { title, description, required_skills, waste_types, duration, location, date } =
    req.body;

  try {
    const image_url = await getOpportunityImageUrl(req.file);
    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills: Array.isArray(required_skills)
        ? required_skills
        : required_skills
          ? JSON.parse(required_skills)
          : [],
      waste_types: Array.isArray(waste_types)
        ? waste_types
        : waste_types
          ? JSON.parse(waste_types)
          : [],
      duration,
      location,
      date,
      image_url,
    });
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunities = async (req, res) => {
  try {
    const { status, search, city } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (city && city !== 'all') {
      query.location = { $regex: city, $options: 'i' };
    }

    if (search) {
      const searchConditions = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { required_skills: { $regex: search, $options: 'i' } },
      ];

      // Only search location if city filter is not already applied
      if (!city || city === 'all') {
        searchConditions.push({ location: { $regex: search, $options: 'i' } });
      }

      query.$or = searchConditions;
    }

    const opportunities = await Opportunity.find(query)
      .populate('ngo_id', 'name email')
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "ngo_id",
      "name email",
    );
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (!canManageOpportunity(opportunity, req.user)) {
      return res.status(403).json({ message: "Not authorized to modify this opportunity" });
    }

    if (req.body.title) opportunity.title = req.body.title;

    if (req.body.description) opportunity.description = req.body.description;

    if (req.body.duration) opportunity.duration = req.body.duration;

    if (req.body.location) opportunity.location = req.body.location;

    if (req.body.date) opportunity.date = req.body.date;

    if (req.body.status) opportunity.status = req.body.status;

    if (req.body.required_skills) {
      opportunity.required_skills = Array.isArray(req.body.required_skills)
        ? req.body.required_skills
        : JSON.parse(req.body.required_skills);
    }

    if (req.body.waste_types) {
      opportunity.waste_types = Array.isArray(req.body.waste_types)
        ? req.body.waste_types
        : JSON.parse(req.body.waste_types);
    }

    if (req.file) {
      opportunity.image_url = await getOpportunityImageUrl(req.file);
    }
    const updated = await opportunity.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (!canManageOpportunity(opportunity, req.user)) {
      return res.status(403).json({ message: "Not authorized to modify this opportunity" });
    }

    await Application.deleteMany({ opportunity_id: req.params.id });
    await opportunity.deleteOne();
    res.json({ message: "Opportunity and related applications deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyForOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (opportunity.status !== "open") {
      return res.status(400).json({ message: "This opportunity is not open for applications" });
    }

    const existing = await Application.findOne({
      opportunity_id: req.params.id,
      volunteer_id: req.user._id,
    });
    if (existing) return res.status(400).json({ message: "Already applied" });
    const application = await Application.create({
      opportunity_id: req.params.id,
      volunteer_id: req.user._id,
    });

    await Notification.create({
      user_id: opportunity.ngo_id,
      type: "application",
      title: "New volunteer application",
      message: `${req.user.name} applied for ${opportunity.title}`,
      link: `/opportunities/${opportunity._id}`,
    });
    req.app.get("io")?.to(`user:${opportunity.ngo_id}`).emit("notification:new");

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunityApplications = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "ngo_id",
      "name email",
    );
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    const canReview = isOpportunityOwner(opportunity, req.user);
    const canViewStatus = req.user?.role === "admin";

    if (!canReview && !canViewStatus) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    let applicationsQuery = Application.find({
      opportunity_id: req.params.id,
    })
      .populate("reviewed_by", "name email role")
      .sort({ createdAt: -1 });

    if (canReview) {
      applicationsQuery = applicationsQuery.populate("volunteer_id", "name email role location skills");
    }

    const applications = await applicationsQuery;
    const summary = {
      total: applications.length,
      pending: applications.filter((application) => application.status === "pending").length,
      accepted: applications.filter((application) => application.status === "accepted").length,
      rejected: applications.filter((application) => application.status === "rejected").length,
      ngo: opportunity.ngo_id,
    };

    res.json({
      mode: canReview ? "review" : "admin",
      summary,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remark, rejection_remark } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    const application = await Application.findById(req.params.applicationId);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    const opportunity = await Opportunity.findById(application.opportunity_id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (!isOpportunityOwner(opportunity, req.user)) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    application.reviewed_by = req.user._id;
    application.reviewed_at = new Date();

    if (status === 'rejected') {
      application.rejection_remark = rejection_remark || remark || '';
    }

    const updated = await application.save();
    await updated.populate("volunteer_id", "name email role location skills");
    await updated.populate("reviewed_by", "name email role");

    await Notification.create({
      user_id: application.volunteer_id,
      type: "application_status",
      title: `Application ${status}`,
      message: `Your application for ${opportunity.title} was ${status}.`,
      link: "/applications",
    });
    req.app.get("io")?.to(`user:${application.volunteer_id}`).emit("notification:new");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      volunteer_id: req.user._id,
    })
      .populate("opportunity_id", "title ngo_id status")
      .populate("reviewed_by", "name email role");
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;

    if (role === 'ngo') {
      const ngoOpportunities = await Opportunity.find({ ngo_id: userId }).select('_id');
      const oppIds = ngoOpportunities.map(opp => opp._id);

      const applications = await Application.find({ opportunity_id: { $in: oppIds } })
        .populate('opportunity_id', 'title description location status')
        .populate('volunteer_id', 'name email phone location skills')
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: applications });
    }

    if (role === 'volunteer') {
      const applications = await Application.find({ volunteer_id: userId })
        .populate({
          path: 'opportunity_id',
          select: 'title location ngo_id',
          populate: { path: 'ngo_id', select: 'name email' }
        })
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: applications });
    }

    if (role === 'admin') {
      const applications = await Application.find()
        .populate({
          path: 'opportunity_id',
          select: 'title ngo_id',
          populate: { path: 'ngo_id', select: 'name email' }
        })
        .populate('volunteer_id', 'name email')
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: applications });
    }

    return res.status(403).json({ message: 'Unauthorized role' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  getOpportunityApplications,
  updateApplicationStatus,
  getUserApplications,
  getDashboardData,
};
~~~
## backend/controller/otpController.js

~~~javascript
import Otp from '../models/Otp.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

const isStrongPassword = (password) => password.length >= 6 && /\d/.test(password);

// A block-list of common disposable / temp-mail domains. This is not
// exhaustive, but it stops the majority of throwaway addresses used to
// bypass registration (mailinator, tempmail, guerrillamail style services).
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'temp-mail.org', 'guerrillamail.com',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de', 'sharklasers.com',
  '10minutemail.com', '10minutemail.net', 'yopmail.com', 'yopmail.fr',
  'trashmail.com', 'throwawaymail.com', 'fakeinbox.com', 'getnada.com',
  'dispostable.com', 'maildrop.cc', 'moakt.com', 'discard.email', 'mintemail.com',
  'mailnesia.com', 'mytemp.email', 'emailondeck.com', 'mail-temp.com',
  'tempmailo.com', 'tempinbox.com', 'spamgourmet.com', 'mohmal.com',
  'anonbox.net', 'burnermail.io', 'temp-mail.io', 'inboxkitten.com',
]);

const isDisposableEmail = (email) => {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  return Boolean(domain && DISPOSABLE_EMAIL_DOMAINS.has(domain));
};

const createOtpForEmail = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.deleteMany({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);

  await Otp.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  return otp;
};

const sendOtpResponse = async ({ res, email, otp, subject, text }) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const canSendEmail = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (!canSendEmail) {
    return res.json({
      message: isDevelopment
        ? 'Email is not configured. Use the OTP shown below to continue.'
        : 'Email service is not configured. Please try again later.',
      otp: isDevelopment ? otp : undefined,
    });
  }

  try {
    await sendEmail({ to: email, subject, text });
    return res.json({ message: `OTP sent to ${email}` });
  } catch (error) {
    console.error('Email error:', error.message);

    if (isDevelopment) {
      return res.json({
        message: 'Email could not be delivered. Use the OTP shown below to continue.',
        otp,
      });
    }

    return res.status(502).json({
      message: 'Could not send OTP email. Please try again later.',
    });
  }
};

// Reusable check used by authController.registerUser to confirm the email
// was actually verified via OTP before the account is created.
export const verifyEmailOtp = async (email, otp) => {
  const normalizedEmail = email.trim().toLowerCase();
  const otpRecord = await Otp.findOne({ email: normalizedEmail });

  if (!otpRecord) return { valid: false, message: 'OTP not found. Please request a new one.' };
  if (otpRecord.expiresAt < new Date()) return { valid: false, message: 'OTP has expired. Please request a new one.' };

  const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp);
  if (!isOtpMatch) return { valid: false, message: 'Invalid OTP. Please try again.' };

  await Otp.deleteMany({ email: normalizedEmail });
  return { valid: true };
};

export { isDisposableEmail };

export const sendOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = await createOtpForEmail(user.email);

    return sendOtpResponse({
      res,
      email: user.email,
      otp,
      subject: 'WasteZero - Your OTP for Password Change',
      text: `Your OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sends an OTP to verify an email address before an account is created.
// This is what stops registration with fake / temporary inboxes: the OTP
// must be read from the real inbox and submitted back before /auth/register
// will create the user.
export const sendRegisterOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (isDisposableEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Temporary or disposable email addresses are not allowed. Please use a real email address.' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const otp = await createOtpForEmail(normalizedEmail);

    return sendOtpResponse({
      res,
      email: normalizedEmail,
      otp,
      subject: 'WasteZero - Verify your email',
      text: `Your email verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otp = await createOtpForEmail(user.email);

    return sendOtpResponse({
      res,
      email: user.email,
      otp,
      subject: 'WasteZero - Password reset OTP',
      text: `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetForgotPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  if (!isStrongPassword(newPassword))
    return res.status(400).json({ message: 'Password must be at least 6 characters and contain one number' });

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otpRecord = await Otp.findOne({ email: user.email });
    if (!otpRecord)
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });

    const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpMatch)
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email: user.email });

    res.json({ message: 'Password reset successfully. Please sign in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtpAndChangePassword = async (req, res) => {
  const { otp, currentPassword, newPassword, confirmPassword } = req.body;

  if (!otp || !currentPassword || !newPassword || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  if (!isStrongPassword(newPassword))
    return res.status(400).json({ message: 'Password must be at least 6 characters and contain one number' });

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isCurrentMatch = await user.matchPassword(currentPassword);
    if (!isCurrentMatch)
      return res.status(401).json({ message: 'Current password is incorrect' });

    const otpRecord = await Otp.findOne({ email: user.email });
    if (!otpRecord)
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });

    const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpMatch)
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email: user.email });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
~~~
## backend/controller/pickupController.js

~~~javascript
import Notification from '../models/Notification.js';
import Pickup from '../models/Pickup.js';
import User from '../models/User.js';

const populatePickup = (query) =>
  query
    .populate('user_id', 'name email location')
    .populate('assigned_to', 'name email role');

const createPickup = async (req, res) => {
  try {
    const { waste_type, quantity_kg, pickup_date, time_slot, address, notes } = req.body;
    const requestedDate = new Date(pickup_date);
    requestedDate.setHours(23, 59, 59, 999);

    if (Number.isNaN(requestedDate.getTime()) || requestedDate < new Date()) {
      return res.status(400).json({ message: 'Pickup date must be today or later' });
    }

    const pickup = await Pickup.create({
      user_id: req.user._id,
      waste_type,
      quantity_kg,
      pickup_date,
      time_slot,
      address,
      notes: notes || '',
    });

    const coordinators = await User.find({ role: { $in: ['ngo', 'admin'] } }).select('_id');
    if (coordinators.length) {
      await Notification.insertMany(
        coordinators.map((coordinator) => ({
          user_id: coordinator._id,
          type: 'system',
          title: 'New pickup request',
          message: `${req.user.name} scheduled a ${waste_type} pickup.`,
          link: '/pickups',
        })),
      );
      coordinators.forEach((coordinator) => {
        req.app.get('io')?.to(`user:${coordinator._id}`).emit('notification:new');
      });
    }

    const result = await populatePickup(Pickup.findById(pickup._id));
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPickups = async (req, res) => {
  try {
    const query = req.user.role === 'volunteer' ? { user_id: req.user._id } : {};
    if (req.query.status && req.query.status !== 'all') query.status = req.query.status;

    const pickups = await populatePickup(
      Pickup.find(query).sort({ pickup_date: 1, createdAt: -1 }),
    );
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePickupStatus = async (req, res) => {
  try {
    const allowedStatuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid pickup status' });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

    pickup.status = req.body.status;
    if (['confirmed', 'in-progress'].includes(req.body.status)) {
      pickup.assigned_to = req.user._id;
    }
    if (['scheduled', 'cancelled'].includes(req.body.status)) {
      pickup.assigned_to = null;
    }
    await pickup.save();

    await Notification.create({
      user_id: pickup.user_id,
      type: 'system',
      title: `Pickup ${pickup.status}`,
      message: `Your ${pickup.waste_type} pickup is now ${pickup.status}.`,
      link: '/pickups',
    });
    req.app.get('io')?.to(`user:${pickup.user_id}`).emit('notification:new');

    const result = await populatePickup(Pickup.findById(pickup._id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    if (!['scheduled', 'confirmed'].includes(pickup.status)) {
      return res.status(400).json({ message: 'This pickup can no longer be cancelled' });
    }

    pickup.status = 'cancelled';
    pickup.assigned_to = null;
    await pickup.save();

    const result = await populatePickup(Pickup.findById(pickup._id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { cancelPickup, createPickup, getPickups, updatePickupStatus };
~~~
## backend/middleware/authMiddleware.js

~~~javascript
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        try{
            token = req.headers.authorization.split(" ")[1];

            const decode = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await User.findById(decode.id).select('-password');

            if(!req.user){
                return res.status(401).json({ message: 'User no longer exists' });
            }
            next();
        }
        catch(error){
            return res.status(401).json({message: 'Not authorized - invalid token'});
        }
    }

    else if(!token){
        return res.status(401).json({ message: 'Not authorized - no token provided' });
    }
}

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied - Admin only',
    });
  }
};

const ngoOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'ngo' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied - NGO or Admin only',
    });
  }
};

const volunteerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'volunteer') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied - Volunteers only',
    });
  }
};

export { protect, admin, ngoOrAdmin, volunteerOnly };
~~~
## backend/middleware/upload.js

~~~javascript
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
~~~
## backend/middleware/validationMiddleware.js

~~~javascript
import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),

  body('role')
    .optional()
    .isIn(['volunteer', 'ngo']).withMessage('Role must be either volunteer or ngo'),

  body('otp')
    .notEmpty().withMessage('Email verification OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),

  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address'),

  body('bio')
    .optional()
    .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),

  handleValidationErrors,
];

const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  handleValidationErrors,
];

export{
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  handleValidationErrors,
};
~~~
## backend/models/Application.js

~~~javascript
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true
    },
    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewed_at: {
      type: Date,
      default: null
    },
    rejection_remark: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ volunteer_id: 1 });
applicationSchema.index({ opportunity_id: 1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
~~~
## backend/models/Message.js

~~~javascript
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    read_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

messageSchema.index({ sender_id: 1, recipient_id: 1, createdAt: -1 });
messageSchema.index({ recipient_id: 1, read_at: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
~~~
## backend/models/Notification.js

~~~javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['application', 'application_status', 'message', 'system'],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: '',
    },
    read_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ user_id: 1, createdAt: -1 });
notificationSchema.index({ user_id: 1, read_at: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
~~~
## backend/models/Opportunity.js

~~~javascript
import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    required_skills: [{ type: String }],
    waste_types: [{ type: String }],
    duration: {
      type: String,
    },
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'in-progress'],
      default: 'open'
    },
    image_url: {
      type: String,
      default: ''
    },
    date: {
      type: Date
    },
  },
  { timestamps: true }
);

//Indexes for faster queries
opportunitySchema.index({ ngo_id: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ location: 1 });
opportunitySchema.index({ title: 'text', description: 'text', required_skills: 'text' });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
~~~
## backend/models/Otp.js

~~~javascript
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Index for fast email lookup
otpSchema.index({ email: 1 });

// TTL index — MongoDB automatically deletes expired OTPs
// expireAfterSeconds: 0 means delete exactly at expiresAt time
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Otp', otpSchema);
~~~
## backend/models/Pickup.js

~~~javascript
import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    waste_type: {
      type: String,
      enum: ['plastic', 'paper', 'organic', 'e-waste', 'glass', 'metal', 'mixed', 'other'],
      required: true,
    },
    quantity_kg: {
      type: Number,
      required: true,
      min: 0.1,
      max: 10000,
    },
    pickup_date: {
      type: Date,
      required: true,
    },
    time_slot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true },
);

pickupSchema.index({ user_id: 1, createdAt: -1 });
pickupSchema.index({ status: 1, pickup_date: 1 });

const Pickup = mongoose.model('Pickup', pickupSchema);
export default Pickup;
~~~
## backend/models/User.js

~~~javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['volunteer', 'ngo', 'admin'], default: 'volunteer' },
  skills: [{ type: String }],
  waste_types: [{ type: String }],
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  address: { type: String, default: '' },
  coordinates: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
~~~
## backend/package.json

~~~json
{
  "name": "wastezero-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.10.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^7.3.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.3.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^9.0.3",
    "socket.io": "^4.6.1",
    "streamifier": "^0.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
~~~
## backend/routes/authRoutes.js

~~~javascript
import express from 'express';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';
import { registerUser, loginUser } from '../controller/authController.js';
const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;
~~~
## backend/routes/matchingRoutes.js

~~~javascript
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMatchSuggestions } from '../controller/matchingController.js';

const router = express.Router();

router.get('/', protect, getMatchSuggestions);

export default router;
~~~
## backend/routes/messageRoutes.js

~~~javascript
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createMessage, getContacts, getConversation } from '../controller/messageController.js';

const router = express.Router();

router.use(protect);
router.get('/contacts', getContacts);
router.get('/:userId', getConversation);
router.post('/:userId', createMessage);

export default router;
~~~
## backend/routes/notificationRoutes.js

~~~javascript
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../controller/notificationController.js';

const router = express.Router();

router.use(protect);
router.get('/', getNotifications);
router.patch('/read-all', markAllNotificationsRead);
router.patch('/:id/read', markNotificationRead);

export default router;
~~~
## backend/routes/opportunityRoutes.js

~~~javascript
import express from "express";

import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  getOpportunityApplications,
  updateApplicationStatus,
  getUserApplications,
  getDashboardData,
} from "../controller/opportunityController.js";
import { protect, ngoOrAdmin, volunteerOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getOpportunities)
  .post(protect, ngoOrAdmin, upload.single("image"), createOpportunity);

router.get("/dashboard", protect, getDashboardData);

router.get("/my-applications", protect, getUserApplications);

router.route("/applications/:applicationId/status")
  .put(protect, ngoOrAdmin, updateApplicationStatus)
  .patch(protect, ngoOrAdmin, updateApplicationStatus);

router.get("/:id/applications", protect, ngoOrAdmin, getOpportunityApplications);

router
  .route("/:id")
  .get(protect, getOpportunityById)
  .put(protect, ngoOrAdmin, upload.single("image"), updateOpportunity)
  .delete(protect, ngoOrAdmin, deleteOpportunity);

router.post("/:id/apply", protect, volunteerOnly, applyForOpportunity);

export default router;
~~~
## backend/routes/otpRoutes.js

~~~javascript
import express from 'express';
import {
  resetForgotPassword,
  sendForgotPasswordOtp,
  sendOtp,
  sendRegisterOtp,
  verifyOtpAndChangePassword,
} from '../controller/otpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', protect, sendOtp);
router.post('/verify-and-change', protect, verifyOtpAndChangePassword);
router.post('/forgot-password/send', sendForgotPasswordOtp);
router.post('/forgot-password/reset', resetForgotPassword);
router.post('/register/send', sendRegisterOtp);

export default router;
~~~
## backend/routes/pickupRoutes.js

~~~javascript
import express from 'express';
import { ngoOrAdmin, protect, volunteerOnly } from '../middleware/authMiddleware.js';
import {
  cancelPickup,
  createPickup,
  getPickups,
  updatePickupStatus,
} from '../controller/pickupController.js';

const router = express.Router();

router.get('/', protect, getPickups);
router.post('/', protect, volunteerOnly, createPickup);
router.patch('/:id/status', protect, ngoOrAdmin, updatePickupStatus);
router.patch('/:id/cancel', protect, volunteerOnly, cancelPickup);

export default router;
~~~
## backend/routes/userRoutes.js

~~~javascript
import express from 'express';
import { getUserProfile, updateUserProfile } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateUpdateProfile } from '../middleware/validationMiddleware.js';
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateUpdateProfile, updateUserProfile);

export default router;
~~~
## backend/server.js

~~~javascript
import './config/env.js';

import express from 'express';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import matchingRoutes from './routes/matchingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';

connectDB();

const app = express();
const server = http.createServer(app);
const allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
const io = new Server(server, {
  cors: { origin: allowedOrigins },
});
app.set('io', io);

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());

app.get('/', (req, res) => res.send('WasteZero API running...'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/matches', matchingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/pickups', pickupRoutes);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id');
    if (!user) return next(new Error('User not found'));
    socket.userId = user._id.toString();
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`);
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
~~~
## backend/utils/sendEmail.js

~~~javascript
import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"WasteZero" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

export default sendEmail;
~~~
## frontend/.editorconfig

~~~text
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single
ij_typescript_use_double_quotes = false

[*.md]
max_line_length = off
trim_trailing_whitespace = false
~~~
## frontend/.gitignore

~~~text
# See https://docs.github.com/get-started/getting-started-with-git/ignoring-files for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log
*.log
/.npm-cache

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/mcp.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings
__screenshots__/

# System files
.DS_Store
Thumbs.db
~~~
## frontend/.prettierrc

~~~text
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
~~~
## frontend/angular.json

~~~json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "packageManager": "npm",
    "analytics": false
  },
  "newProjectRoot": "projects",
  "projects": {
    "frontend": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": [
              "src/styles.css"
            ]
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "600kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "8kB",
                  "maximumError": "8kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "frontend:build:production"
            },
            "development": {
              "buildTarget": "frontend:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "test": {
          "builder": "@angular/build:unit-test"
        }
      }
    }
  }
}
~~~
## frontend/package.json

~~~json
{
  "name": "frontend",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "packageManager": "npm@10.9.3",
  "dependencies": {
    "@angular/common": "^21.2.0",
    "@angular/compiler": "^21.2.0",
    "@angular/core": "^21.2.0",
    "@angular/forms": "^21.2.0",
    "@angular/platform-browser": "^21.2.0",
    "@angular/router": "^21.2.0",
    "rxjs": "~7.8.0",
    "socket.io-client": "^4.8.1",
    "tslib": "^2.3.0",
    "zone.js": "^0.16.2"
  },
  "devDependencies": {
    "@angular/build": "^21.2.17",
    "@angular/cli": "^21.2.17",
    "@angular/compiler-cli": "^21.2.0",
    "jsdom": "^28.0.0",
    "prettier": "^3.8.1",
    "typescript": "~5.9.2",
    "vitest": "^4.0.8"
  }
}
~~~
## frontend/src/app/app.config.ts

~~~typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(ReactiveFormsModule),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
~~~
## frontend/src/app/app.css

~~~css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(27, 94, 32, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-brand {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--green-dark);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-links a {
  color: var(--ink);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}
.nav-links a:hover {
  background: var(--green-light);
  color: var(--green-dark);
}
.nav-links a.active {
  background: var(--green-light);
  color: var(--green-dark);
  font-weight: 600;
}

.nav-links button {
  margin-left: 6px;
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.nav-links button:hover {
  border-color: var(--green);
  color: var(--green);
}
~~~
## frontend/src/app/app.html

~~~html
<router-outlet></router-outlet>
<app-toast-host></app-toast-host>
~~~
## frontend/src/app/app.routes.ts

~~~typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { Shell } from './layout/shell';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './profile/profile';
import { authGuard } from './guards/auth.guard';
import { OpportunityList } from './opportunities/opportunity-list/opportunity-list';
import { CreateOpportunity } from './opportunities/create-opportunity/create-opportunity';
import { EditOpportunity } from './opportunities/edit-opportunity/edit-opportunity';
import { OpportunityDetail } from './opportunities/opportunity-detail/opportunity-detail';
import { ApplicationsComponent } from './applications/applications';
import { Messages } from './messages/messages';
import { Notifications } from './notifications/notifications';
import { MatchSuggestions } from './match-suggestions/match-suggestions';
import { Pickups } from './pickups/pickups';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'profile', component: Profile },
      { path: 'messages', component: Messages },
      { path: 'notifications', component: Notifications },
      { path: 'match-suggestions', component: MatchSuggestions },
      { path: 'pickups', component: Pickups },

      { path: 'opportunities', component: OpportunityList },
      { path: 'opportunities/create', component: CreateOpportunity },
      { path: 'opportunities/edit/:id', component: EditOpportunity },
      { path: 'opportunities/:id', component: OpportunityDetail },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
~~~
## frontend/src/app/app.spec.ts

~~~typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';


describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    //await fixture.whenStable();
    // const compiled = fixture.nativeElement as HTMLElement;
    //expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
~~~
## frontend/src/app/app.ts

~~~typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastHost } from './shared/toast-host/toast-host';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastHost],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
~~~
## frontend/src/app/applications/applications.css

~~~css
.applications-container {
  max-width: 1180px;
}

.app-head {
  background: linear-gradient(135deg, #123924, #278a49);
  border-radius: 18px;
  color: #fff;
  padding: 28px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.app-head h1 {
  margin: 0 0 5px;
  font-size: 2rem;
}

.app-head .sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 18px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.panel-head h2 {
  margin: 0;
  font-size: 1.08rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 14px;
  margin-bottom: 18px;
}

.card {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card:hover, .card.active {
  border-color: #278a49;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.card h4 {
  margin: 0 0 6px;
  font-size: 0.98rem;
  color: var(--ink);
}

.card .count {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
  font-weight: 600;
}

.details-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 0.9rem;
}

.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.data-table th {
  color: var(--muted);
  font-weight: 600;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: capitalize;
  display: inline-block;
}

.badge.pending { background: #fff3e0; color: #e65100; }
.badge.accepted { background: #e8f5e9; color: #2e7d32; }
.badge.rejected { background: #fdecea; color: #c62828; }

.btn-accept {
  background: #278a49;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  margin-right: 8px;
}

.btn-reject {
  background: #c62828;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.font-bold { font-weight: 700; font-size: 0.85rem; }

.remark-text {
  color: #c62828;
  font-style: italic;
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.modal-content textarea {
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--ink);
  padding: 10px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn-cancel {
  background: var(--input-bg);
  color: var(--ink);
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirm-reject {
  background: #c62828;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 820px) {
  .data-table {
    display: block;
    overflow-x: auto;
  }
}
~~~
## frontend/src/app/applications/applications.html

~~~html
<section class="applications-container">
  <header class="app-head">
    <div>
      <p class="eyebrow">Management</p>
      <h1>Applications</h1>
      <p class="sub">
        @if (role === 'ngo') { Review and manage volunteer application requests for your opportunities. }
        @else if (role === 'volunteer') { Track status and responses for your submitted opportunity applications. }
        @else { System-wide overview of all submitted volunteer applications. }
      </p>
    </div>
  </header>

  @if (isLoading) {
    <div class="panel">
      <p class="muted">Loading applications data...</p>
    </div>
  } @else {
    <!-- NGO VIEW -->
    @if (role === 'ngo') {
      <div class="panel">
        <div class="panel-head">
          <h2>Your Opportunities & Applicants</h2>
          <span class="muted">Click an opportunity card below to view applicant details</span>
        </div>

        <div class="summary-cards">
          @for (oppId of ObjectKeys; track oppId) {
            <div
              class="card"
              [class.active]="selectedOpportunityId === oppId"
              (click)="selectOpportunity(oppId)">
              <h4>{{ groupedOpportunities[oppId].title }}</h4>
              <p class="count">Total Applications: {{ groupedOpportunities[oppId].applications.length }}</p>
            </div>
          } @empty {
            <p class="muted">No opportunity applications received yet.</p>
          }
        </div>

        @if (selectedOpportunityId && groupedOpportunities[selectedOpportunityId]) {
          <div class="details-section">
            <h3>Applications for "{{ groupedOpportunities[selectedOpportunityId].title }}"</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Volunteer Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Rejection Remark</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (app of groupedOpportunities[selectedOpportunityId].applications; track app._id) {
                  <tr>
                    <td>{{ app.volunteer_id?.name || 'N/A' }}</td>
                    <td>{{ app.volunteer_id?.email || 'N/A' }}</td>
                    <td>
                      <span class="badge" [class]="app.status">{{ app.status }}</span>
                    </td>
                    <td>
                      @if (app.status === 'rejected') {
                        <span class="remark-text">{{ app.rejection_remark || 'No remark provided' }}</span>
                      } @else {
                        <span>-</span>
                      }
                    </td>
                    <td>
                      @if (app.status === 'pending') {
                        <button class="btn-accept" (click)="acceptApplication(app._id)">Accept</button>
                        <button class="btn-reject" (click)="openRejectModal(app._id)">Reject</button>
                      } @else if (app.status === 'accepted') {
                        <span class="muted font-bold">Accepted</span>
                      } @else if (app.status === 'rejected') {
                        <span class="muted font-bold">Rejected</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    }

    <!-- VOLUNTEER VIEW -->
    @if (role === 'volunteer') {
      <div class="panel">
        <div class="panel-head">
          <h2>My Opportunity Applications</h2>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>NGO</th>
              <th>Status</th>
              <th>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            @for (app of applications; track app._id) {
              <tr>
                <td>{{ app.opportunity_id?.title || 'N/A' }}</td>
                <td>{{ getNgoDisplay(app) }}</td>
                <td><span class="badge" [class]="app.status">{{ app.status }}</span></td>
                <td>
                  @if (app.status === 'rejected') {
                    <span class="remark-text">{{ app.rejection_remark || 'No reason specified' }}</span>
                  } @else {
                    <span>-</span>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="muted">You haven't applied to any opportunities yet.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- ADMIN VIEW -->
    @if (role === 'admin') {
      <div class="panel">
        <div class="panel-head">
          <h2>Platform Applications Overview</h2>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Volunteer</th>
              <th>NGO</th>
              <th>Status</th>
              <th>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            @for (app of applications; track app._id) {
              <tr>
                <td>{{ app.opportunity_id?.title || 'N/A' }}</td>
                <td>{{ app.volunteer_id?.name || 'N/A' }} ({{ app.volunteer_id?.email }})</td>
                <td>{{ getNgoDisplay(app) }}</td>
                <td><span class="badge" [class]="app.status">{{ app.status }}</span></td>
                <td>{{ app.rejection_remark || '-' }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="muted">No application records found across the platform.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  }

  <!-- REJECTION REMARK MODAL -->
  @if (showRejectModal) {
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>Reject Application</h3>
        <p>Please enter the reason for rejection (visible to the applicant):</p>
        <textarea [(ngModel)]="rejectionRemark" rows="4" placeholder="Enter rejection reason..."></textarea>

        <div class="modal-actions">
          <button class="btn-cancel" (click)="closeRejectModal()">Cancel</button>
          <button class="btn-confirm-reject" (click)="confirmReject()">Reject Application</button>
        </div>
      </div>
    </div>
  }
</section>
~~~
## frontend/src/app/applications/applications.ts

~~~typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpportunityService } from '../opportunities/opportunity.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

interface Application {
  _id: string;
  opportunity_id?: {
    _id: string;
    title: string;
    location?: string;
    status?: string;
    ngo_id?: { _id: string; name: string; email: string };
  };
  volunteer_id?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    skills?: string[];
  };
  ngo_id?: { _id: string; name: string; email: string };
  status: 'pending' | 'accepted' | 'rejected';
  rejection_remark?: string;
}

interface GroupedOpportunity {
  title: string;
  applications: Application[];
}

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class ApplicationsComponent implements OnInit {
  user: any;
  role: string = 'volunteer';
  isLoading: boolean = false;

  applications: Application[] = [];
  groupedOpportunities: Record<string, GroupedOpportunity> = {};
  selectedOpportunityId: string | null = null;

  showRejectModal: boolean = false;
  selectedAppIdForReject: string | null = null;
  rejectionRemark: string = '';

  constructor(
    private authService: AuthService,
    private opportunityService: OpportunityService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {
    this.user = this.authService.getUser();
    this.role = this.user?.role || 'volunteer';
  }

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.isLoading = true;
    this.opportunityService.getDashboardData().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.applications = res.data || [];

        if (this.role === 'ngo') {
          this.groupApplicationsByOpportunity();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching applications:', err);
        this.cdr.detectChanges();
      }
    });
  }

  groupApplicationsByOpportunity(): void {
    this.groupedOpportunities = {};
    this.applications.forEach(app => {
      const oppId = app.opportunity_id?._id || 'unknown';
      if (!this.groupedOpportunities[oppId]) {
        this.groupedOpportunities[oppId] = {
          title: app.opportunity_id?.title || 'Opportunity Details',
          applications: []
        };
      }
      this.groupedOpportunities[oppId].applications.push(app);
    });
  }

  selectOpportunity(oppId: string): void {
    this.selectedOpportunityId = this.selectedOpportunityId === oppId ? null : oppId;
  }

  acceptApplication(appId: string): void {
    if (!confirm('Accept this volunteer application?')) return;

    this.opportunityService.updateApplicationStatus(appId, { status: 'accepted' }).subscribe({
      next: () => {
        this.toast.success('Application accepted');
        this.fetchApplications();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to accept application');
        console.error('Failed to accept application:', err);
      }
    });
  }

  openRejectModal(appId: string): void {
    this.selectedAppIdForReject = appId;
    this.rejectionRemark = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedAppIdForReject = null;
    this.rejectionRemark = '';
  }

  confirmReject(): void {
    if (!this.selectedAppIdForReject) return;
    if (!confirm('Reject this volunteer application?')) return;

    this.opportunityService.updateApplicationStatus(this.selectedAppIdForReject, {
      status: 'rejected',
      rejection_remark: this.rejectionRemark
    }).subscribe({
      next: () => {
        this.toast.success('Application rejected');
        this.closeRejectModal();
        this.fetchApplications();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to reject application');
        console.error('Failed to reject application:', err);
      }
    });
  }

  getNgoDisplay(app: Application): string {
    const ngo = app.opportunity_id?.ngo_id || app.ngo_id;
    if (!ngo) return 'N/A';

    const ngoName = ngo.name || ngo.email || 'NGO';
    const rawId = ngo._id ? String(ngo._id) : '';
    const lastSixId = rawId.length >= 6 ? rawId.slice(-6).toUpperCase() : rawId;

    return lastSixId ? `${ngoName} (${lastSixId})` : ngoName;
  }

  get ObjectKeys(): string[] {
    return Object.keys(this.groupedOpportunities);
  }
}
~~~
## frontend/src/app/auth/forgot-password/forgot-password.css

~~~css
.form-success {
  background: #e8f7ef;
  border: 1px solid #a8dfbf;
  border-radius: 11px;
  color: #17663a;
  font-size: 0.88rem;
  margin-bottom: 16px;
  padding: 11px 13px;
}

.reset-note {
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.45;
  margin: -6px 0 17px;
}

.dev-otp {
  color: #17663a;
  font-weight: 700;
}
~~~
## frontend/src/app/auth/forgot-password/forgot-password.html

~~~html
<div class="auth-split">
  <aside class="auth-hero">
    <div class="hero-content">
      <div class="hero-logo">WasteZero</div>
      <h2>Get back to your cleaner tomorrow</h2>
      <p class="lead">
        Reset your password with a secure email OTP and return to managing pickups,
        recycling stats, and community requests.
      </p>
      <ul class="hero-points">
        <li><span class="tick">OK</span> Verify your registered mail id</li>
        <li><span class="tick">OK</span> Use a 10 minute reset OTP</li>
        <li><span class="tick">OK</span> Sign in again to access your dashboard</li>
      </ul>

      <div class="hero-stats">
        <div><strong>OTP</strong><span>Email secured</span></div>
        <div><strong>10m</strong><span>Reset window</span></div>
        <div><strong>24/7</strong><span>Account access</span></div>
      </div>
    </div>
  </aside>

  <div class="auth-form-side">
    <div class="auth-form">
      <div class="auth-head">
        <span class="mini-logo">WasteZero</span>
        <h1>Forgot password</h1>
        <p>Use your registered mail id to reset your password.</p>
      </div>

      @if (error) {
        <div class="form-error">{{ error }}</div>
      }
      @if (success) {
        <div class="form-success">{{ success }}</div>
      }

      @if (!otpSent) {
        <form [formGroup]="requestForm" (ngSubmit)="requestOtp()">
          <div class="field">
            <label>Email address</label>
            <input formControlName="email" type="email" placeholder="you@example.com">
          </div>
          <p class="reset-note">We will send a 6 digit OTP to this email.</p>

          <button class="btn-primary" type="submit" [disabled]="loading">
            {{ loading ? 'Sending OTP...' : 'Send OTP' }}
          </button>
        </form>
      } @else {
        <form [formGroup]="resetForm" (ngSubmit)="resetPassword()">
          <div class="field">
            <label>OTP</label>
            <input formControlName="otp" inputmode="numeric" placeholder="6 digit OTP">
          </div>
          @if (devOtp) {
            <p class="reset-note dev-otp">Local OTP: <strong>{{ devOtp }}</strong></p>
          } @else {
            <p class="reset-note">Check the inbox for {{ email }}.</p>
          }

          <div class="field">
            <label>New password</label>
            <div class="password-wrap">
              <input formControlName="newPassword" [type]="showPassword ? 'text' : 'password'" placeholder="At least 6 characters and 1 number">
              <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <small>Use at least 6 characters and include one number.</small>
          </div>

          <div class="field">
            <label>Confirm password</label>
            <div class="password-wrap">
              <input formControlName="confirmPassword" [type]="showPassword ? 'text' : 'password'" placeholder="Re-enter password">
              <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <button class="btn-primary" type="submit" [disabled]="loading">
            {{ loading ? 'Resetting...' : 'Reset password' }}
          </button>
        </form>
      }

      <p class="auth-alt">Remembered it? <a routerLink="/login">Sign in</a></p>
    </div>
  </div>
</div>
~~~
## frontend/src/app/auth/forgot-password/forgot-password.ts

~~~typescript
import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OtpService } from '../../services/otp.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  requestForm: FormGroup;
  resetForm: FormGroup;
  error = '';
  success = '';
  devOtp = '';
  loading = false;
  otpSent = false;
  email = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private cdr: ChangeDetectorRef,
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]],
      confirmPassword: ['', Validators.required],
    });
  }

  requestOtp() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    this.email = this.requestForm.value.email;

    this.otpService.sendForgotPasswordOtp(this.email).subscribe({
      next: (res) => {
        this.otpSent = true;
        this.success = res.message || 'OTP sent to your email.';
        this.devOtp = res.otp || '';
        if (this.devOtp) {
          this.resetForm.patchValue({ otp: this.devOtp });
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not send OTP.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    if (this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (!/\d/.test(this.resetForm.value.newPassword)) {
      this.error = 'Password must contain at least one number';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.otpService.resetForgotPassword({
      email: this.email,
      ...this.resetForm.value,
    }).subscribe({
      next: (res) => {
        this.success = res.message || 'Password reset successfully. You can sign in now.';
        this.loading = false;
        this.resetForm.reset();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not reset password.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
~~~
## frontend/src/app/auth/login/login.css

~~~css

~~~
## frontend/src/app/auth/login/login.html

~~~html
<div class="auth-split">
  <button class="auth-theme-toggle" type="button" (click)="toggleTheme()">
    {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
  </button>

  <aside class="auth-hero">
    <div class="hero-content">
      <div class="hero-logo">WasteZero</div>
      <h2>Welcome back to a cleaner tomorrow</h2>
      <p class="lead">
        Sign in to manage your pickups, track your recycling impact, and stay connected
        with your community.
      </p>
      <ul class="hero-points">
        <li><span class="tick">OK</span> Schedule &amp; track waste pickups</li>
        <li><span class="tick">OK</span> Monitor your recycling stats</li>
        <li><span class="tick">OK</span> Connect with local collectors &amp; NGOs</li>
      </ul>

      <div class="hero-stats">
        <div><strong>12K+</strong><span>Pickups done</span></div>
        <div><strong>850+</strong><span>Active agents</span></div>
        <div><strong>4.9/5</strong><span>User rating</span></div>
      </div>
    </div>
  </aside>

  <div class="auth-form-side">
    <div class="auth-form">
      <div class="auth-head">
        <span class="mini-logo">WasteZero</span>
        <h1>Sign in</h1>
        <p>Enter your details to access your account.</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
        @if (error) {
          <div class="form-error">{{ error }}</div>
        }

        <div class="field">
          <label>Email address</label>
          <input formControlName="email" type="email" placeholder="you@example.com">
        </div>

        <div class="field">
          <label>Password</label>
          <div class="password-wrap">
            <input formControlName="password" [type]="showPassword ? 'text' : 'password'" placeholder="Password">
            <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <a class="forgot-link" routerLink="/forgot-password">Forgot password?</a>
        </div>

        <button class="btn-primary" type="submit" [disabled]="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p class="auth-alt">Don't have an account? <a routerLink="/register">Create one</a></p>
    </div>
  </div>
</div>
~~~
## frontend/src/app/auth/login/login.spec.ts

~~~typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';


class MockAuthService {
  login() {
    return Promise.resolve(true);
  }

  getUser() {
    return {
      role: 'volunteer'
    };
  }
}

describe('Login', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent,HttpClientTestingModule,RouterTestingModule   ],

      providers: [

        {
          provide: AuthService,
          useClass: MockAuthService
        }

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
     //await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render login form', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
  });
});
~~~
## frontend/src/app/auth/login/login.ts

~~~typescript
import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppTheme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';
  loading = false;
  showPassword = false;
  theme: AppTheme = 'light';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
    this.theme = this.themeService.theme;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggleTheme() {
    this.theme = this.themeService.toggle();
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.auth.saveAuth(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
~~~
## frontend/src/app/auth/register/register.css

~~~css
.otp-field small {
  display: block;
  margin-top: 6px;
  font-size: 0.78rem;
  color: var(--muted);
}

.otp-field .otp-error {
  color: var(--danger);
  font-weight: 600;
}

.form-success {
  background: #e8f7ef;
  border: 1px solid #a8dfbf;
  border-radius: 11px;
  color: #17663a;
  font-size: 0.88rem;
  margin-bottom: 16px;
  padding: 11px 13px;
}

.otp-field .dev-otp {
  color: #17663a;
  font-weight: 700;
}

.otp-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.otp-actions .btn-primary {
  flex: 1;
}

.btn-secondary {
  flex: 1;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-secondary:hover {
  background: var(--surface-hover);
}
~~~
## frontend/src/app/auth/register/register.html

~~~html
<div class="auth-split">
  <button class="auth-theme-toggle" type="button" (click)="toggleTheme()">
    {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
  </button>

  <aside class="auth-hero">
    <div class="hero-content">
      <div class="hero-logo">WasteZero</div>
      <h2>Join the movement for a cleaner planet</h2>
      <p class="lead">
        Create your account to schedule smart waste pickups, track your recycling impact,
        and connect with collectors and NGOs near you.
      </p>
      <ul class="hero-points">
        <li><span class="tick">OK</span> Schedule pickups in seconds</li>
        <li><span class="tick">OK</span> Categorize plastic, organic &amp; e-waste</li>
        <li><span class="tick">OK</span> Get matched with agents by location</li>
        <li><span class="tick">OK</span> Track your personal recycling stats</li>
      </ul>

      <div class="hero-stats">
        <div><strong>12K+</strong><span>Pickups done</span></div>
        <div><strong>850+</strong><span>Active agents</span></div>
        <div><strong>4.9/5</strong><span>User rating</span></div>
      </div>
    </div>
  </aside>

  <div class="auth-form-side">
    <div class="auth-form">
      <div class="auth-head">
        <span class="mini-logo">WasteZero</span>
        <p class="auth-badge">For volunteers and NGOs</p>
        <h1>Create your account</h1>
        <p>It's free and takes less than a minute.</p>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="otpSent ? onRegister() : sendOtp()">
        @if (error) {
          <div class="form-error">{{ error }}</div>
        }
        @if (otpNotice) {
          <div class="form-success">{{ otpNotice }}</div>
        }

        <div class="field">
          <label>Full name</label>
          <input formControlName="name" placeholder="Jane Doe" [readonly]="otpSent">
        </div>

        <div class="field">
          <label>Email address</label>
          <input formControlName="email" type="email" placeholder="you@example.com" [readonly]="otpSent">
        </div>

        <div class="form-row">
          <div class="field">
            <label>Create a password</label>
            <div class="password-wrap">
              <input formControlName="password" [type]="showPassword ? 'text' : 'password'" placeholder="At least 6 characters and 1 number" [readonly]="otpSent">
              <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <small>Use at least 6 characters and include one number.</small>
          </div>
          <div class="field">
            <label>Confirm password</label>
            <div class="password-wrap">
              <input formControlName="confirmPassword" [type]="showPassword ? 'text' : 'password'" placeholder="Re-enter password" [readonly]="otpSent">
              <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label>Role</label>
            <select formControlName="role" [attr.disabled]="otpSent ? true : null">
              <option value="volunteer">Volunteer</option>
              <option value="ngo">NGO</option>
            </select>
          </div>
          <div class="field">
            <label>Location</label>
            <input formControlName="location" placeholder="City / area" [readonly]="otpSent">
          </div>
        </div>

        @if (!otpSent) {
          <button class="btn-primary" type="submit" [disabled]="sendingOtp">
            {{ sendingOtp ? 'Sending OTP...' : 'Verify email' }}
          </button>
        } @else {
          <div class="field otp-field" [formGroup]="otpForm">
            <label>Email verification OTP</label>
            <input formControlName="otp" inputmode="numeric" placeholder="6 digit OTP" maxlength="6">
            @if (otpError) {
              <small class="otp-error">{{ otpError }}</small>
            } @else if (devOtp) {
              <small class="dev-otp">Local OTP: <strong>{{ devOtp }}</strong></small>
            } @else {
              <small>We sent a 6 digit code to {{ otpVerifiedEmail }}. It's valid for 10 minutes.</small>
            }
          </div>

          <div class="otp-actions">
            <button class="btn-secondary" type="button" (click)="editDetails()">Edit details</button>
            <button class="btn-primary" type="submit" [disabled]="loading">
              {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        }
      </form>

      <div class="auth-trust">
        <span>Secure signup</span>
        <span>Role based access</span>
        <span>Local impact</span>
      </div>

      <p class="auth-alt">
        Already have an account? <a routerLink="/login">Sign in</a>
        <span class="auth-separator">|</span>
        <a routerLink="/forgot-password">Forgot password?</a>
      </p>
    </div>
  </div>
</div>
~~~
## frontend/src/app/auth/register/register.spec.ts

~~~typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';


import { Register } from './register';
import { AuthService } from '../../services/auth.service';

class MockAuthService {
  register() {
    return Promise.resolve(true);
  }
}

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register,HttpClientTestingModule],
      providers: [{
          provide: AuthService,useClass: MockAuthService
        },
        provideRouter([]),
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    //await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render registration form', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
  });
});
~~~
## frontend/src/app/auth/register/register.ts

~~~typescript
import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OtpService } from '../../services/otp.service';
import { AppTheme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  otpForm: FormGroup;
  error = '';
  otpError = '';
  otpNotice = '';
  devOtp = '';
  loading = false;
  sendingOtp = false;
  showPassword = false;
  theme: AppTheme = 'light';

  // Once the email OTP has been sent, the details form is locked and the
  // OTP field is shown. This is what actually stops sign-ups with fake or
  // temporary inboxes: the account is only created after the OTP sent to
  // that address is verified.
  otpSent = false;
  otpVerifiedEmail = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private otpService: OtpService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
    this.theme = this.themeService.theme;
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]],
      confirmPassword: ['', Validators.required],
      role: ['volunteer'],
      location: [''],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  toggleTheme() {
    this.theme = this.themeService.toggle();
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  sendOtp() {
    this.error = '';
    if (this.emailControl?.invalid) {
      this.emailControl.markAsTouched();
      this.error = 'Enter a valid email address first';
      return;
    }
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error = 'Please fill in all required fields before verifying your email';
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.sendingOtp = true;
    const email = this.registerForm.value.email;

    this.otpService.sendRegisterOtp(email).subscribe({
      next: (res) => {
        this.otpSent = true;
        this.otpVerifiedEmail = email;
        this.otpNotice = res.message || `OTP sent to ${email}`;
        this.devOtp = res.otp || '';
        if (this.devOtp) {
          this.otpForm.patchValue({ otp: this.devOtp });
        }
        this.sendingOtp = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not send verification OTP';
        this.sendingOtp = false;
        this.cdr.detectChanges();
      },
    });
  }

  editDetails() {
    this.otpSent = false;
    this.otpError = '';
    this.otpNotice = '';
    this.devOtp = '';
    this.otpForm.reset();
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    if (!this.otpSent || this.otpVerifiedEmail !== this.registerForm.value.email) {
      this.error = 'Please verify your email with the OTP before creating an account';
      return;
    }
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      this.otpError = 'Enter the 6 digit OTP sent to your email';
      return;
    }

    this.loading = true;
    this.error = '';
    this.otpError = '';

    const { confirmPassword, ...data } = this.registerForm.value;
    const payload = { ...data, otp: this.otpForm.value.otp };

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.auth.saveAuth(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const e = err.error;
        this.error = e?.errors?.length
          ? e.errors.map((x: any) => x.message).join(', ')
          : e?.message || 'Registration failed';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
~~~
## frontend/src/app/dashboard/dashboard.css

~~~css
.dash { max-width: 1180px; }

.dash-head {
  background: linear-gradient(135deg, #123924, #278a49);
  border-radius: 18px;
  color: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  padding: 28px;
}
.eyebrow {
  margin: 0 0 4px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}
.dash-head h1 {
  margin: 0 0 5px;
  font-size: 2rem;
}
.dash-head .sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
}
.head-actions { display: flex; gap: 10px; align-items: center; }
.head-link {
  background: #fff;
  border-radius: 10px;
  color: #17462b;
  font-size: 0.84rem;
  font-weight: 800;
  padding: 9px 13px;
  text-decoration: none;
  white-space: nowrap;
}
.role-tag {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  padding: 6px 15px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.12s, box-shadow 0.2s;
}
.stat-card:hover {
  border-color: rgba(39, 138, 73, 0.32);
}
.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.stat-ic {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #17462b;
  font-weight: 800;
  font-size: 0.78rem;
}
.trend {
  font-size: 0.78rem;
  font-weight: 700;
  color: #2e7d32;
  background: #e8f5e9;
  padding: 3px 9px;
  border-radius: 999px;
}
.trend.down {
  color: #c62828;
  background: #fdecea;
}
.stat-value {
  display: block;
  font-size: 1.9rem;
  line-height: 1;
}
.stat-label {
  color: var(--muted);
  font-size: 0.88rem;
}

/* SUMMARY CARDS & APPLICATION PANELS */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 14px;
  margin-bottom: 18px;
}

.card {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card:hover, .card.active {
  border-color: #278a49;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.card h4 {
  margin: 0 0 6px;
  font-size: 0.98rem;
  color: var(--ink);
}

.card .count {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
  font-weight: 600;
}

.details-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.details-section h3 {
  margin: 0 0 12px;
  font-size: 1rem;
}

/* APPLICATION TABLES */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 0.9rem;
}

.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.data-table th {
  color: var(--muted);
  font-weight: 600;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* STATUS BADGES */
.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: capitalize;
  display: inline-block;
}

.badge.pending {
  background: #fff3e0;
  color: #e65100;
}

.badge.accepted {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge.rejected {
  background: #fdecea;
  color: #c62828;
}

/* ACTION BUTTONS */
.btn-accept {
  background: #278a49;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  margin-right: 8px;
  transition: opacity 0.15s;
}

.btn-reject {
  background: #c62828;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-accept:hover, .btn-reject:hover {
  opacity: 0.88;
}

.remark-text {
  color: #c62828;
  font-style: italic;
  font-size: 0.85rem;
}

/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  width: 420px;
  max-width: 90%;
  box-shadow: var(--shadow-md, 0 10px 25px rgba(0,0,0,0.15));
}

.modal-content h3 {
  margin: 0 0 8px;
  font-size: 1.15rem;
  color: var(--ink);
}

.modal-content p {
  margin: 0 0 12px;
  font-size: 0.88rem;
  color: var(--muted);
}

.modal-content textarea {
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--ink);
  padding: 10px;
  font-size: 0.9rem;
  box-sizing: border-box;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn-cancel {
  background: var(--input-bg);
  color: var(--ink);
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirm-reject {
  background: #c62828;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.panels {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 18px;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.panel-head h2 {
  margin: 0;
  font-size: 1.08rem;
}
.panel-head .muted,
.panel-head .link {
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
}
.link.soon {
  cursor: default;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.bar-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 500;
}
.bar-label .pct {
  color: var(--muted);
  font-weight: 700;
}
.bar {
  height: 9px;
  background: #eef3f0;
  border-radius: 999px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

.quick {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.q {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--ink);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.92rem;
  border: 1px solid transparent;
}
a.q:hover {
  background: var(--green-light);
  border-color: #cfe8d3;
  color: var(--green-dark);
}
.q.soon {
  color: #9aa8a0;
  cursor: default;
}

.activity {
  list-style: none;
  margin: 0;
  padding: 0;
}
.activity li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-top: 1px solid var(--border);
  font-size: 0.92rem;
}
.activity li:first-child {
  border-top: none;
}
.activity .a-text {
  flex: 1;
}
.activity em {
  color: var(--muted);
  font-style: normal;
  font-size: 0.82rem;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot.green {
  background: #43a047;
}
.dot.blue {
  background: #1e88e5;
}
.dot.amber {
  background: #fb8c00;
}

@media (max-width: 820px) {
  .dash-head,
  .head-actions {
    flex-direction: column;
  }
  .panels {
    grid-template-columns: 1fr;
  }
  .data-table {
    display: block;
    overflow-x: auto;
  }
}
~~~
## frontend/src/app/dashboard/dashboard.html

~~~html
<section class="dash">
  <header class="dash-head">
    <div>
      <p class="eyebrow">Overview</p>
      <h1>Welcome back, {{ user?.name }}</h1>
      <p class="sub">{{ greeting }}</p>
    </div>
    <div class="head-actions">
      <a routerLink="/opportunities" class="head-link">View opportunities</a>
      <span class="role-tag">{{ role }}</span>
    </div>
  </header>

  <div class="stat-grid">
    @for (s of stats; track s.label) {
      <div class="stat-card">
        <div class="stat-top">
          <div class="stat-ic" [style.background]="s.tint">{{ s.icon }}</div>
          <span class="trend" [class.down]="!s.up">{{ s.up ? '+' : '-' }} {{ s.change }}</span>
        </div>
        <strong class="stat-value">{{ s.value }}</strong>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    }
  </div>

  <div class="panels">
    <div class="panel">
      <div class="panel-head">
        <h2>Recycling progress</h2>
        <span class="muted">This month</span>
      </div>
      <div class="bars">
        @for (c of categories; track c.label) {
          <div class="bar-row">
            <div class="bar-label">
              <span>{{ c.icon }} {{ c.label }}</span>
              <span class="pct">{{ c.pct }}%</span>
            </div>
            <div class="bar">
              <div class="bar-fill" [style.width.%]="c.pct" [style.background]="c.color"></div>
            </div>
          </div>
        }
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h2>Quick actions</h2>
      </div>
      <div class="quick">
        @for (a of actions; track a.label) {
          @if (a.link) {
            <a [routerLink]="a.link" class="q"><span>{{ a.icon }}</span> {{ a.label }}</a>
          } @else {
            <span class="q soon"><span>{{ a.icon }}</span> {{ a.label }}</span>
          }
        }
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <h2>Recent activity</h2>
      <a class="link soon">View all</a>
    </div>
    <ul class="activity">
      @for (a of activity; track a.text) {
        <li>
          <span class="dot" [class]="a.dot"></span>
          <span class="a-text">{{ a.text }}</span>
          <em>{{ a.time }}</em>
        </li>
      }
    </ul>
  </div>
</section>
~~~
## frontend/src/app/dashboard/dashboard.spec.ts

~~~typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Dashboard } from './dashboard';
import { AuthService } from '../services/auth.service';

class MockAuthService {
  getUser() {
    return {
      name: 'Test User',
      role: 'volunteer'
    };
  }
}

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard,HttpClientTestingModule],
      providers: [
          { provide: AuthService, useClass: MockAuthService },
          provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dashboard', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });
});
~~~
## frontend/src/app/dashboard/dashboard.ts

~~~typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OpportunityService } from '../opportunities/opportunity.service';
import { ToastService } from '../services/toast.service';

interface Stat {
  label: string;
  value: number | string;
  icon: string;
  tint: string;
  change: string;
  up: boolean;
}

interface QuickAction {
  label: string;
  icon: string;
  link?: string;
  soon?: boolean;
}

interface Application {
  _id: string;
  opportunity_id?: {
    _id: string;
    title: string;
    location?: string;
    status?: string;
    ngo_id?: { name: string; email: string };
  };
  volunteer_id?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    skills?: string[];
  };
  ngo_id?: { name: string; email: string };
  status: 'pending' | 'accepted' | 'rejected';
  rejection_remark?: string;
}

interface GroupedOpportunity {
  title: string;
  applications: Application[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user: any;
  role = 'volunteer';
  greeting = '';
  stats: Stat[] = [];
  actions: QuickAction[] = [];

  applications: Application[] = [];
  groupedOpportunities: Record<string, GroupedOpportunity> = {};
  selectedOpportunityId: string | null = null;
  isLoading: boolean = false;

  showRejectModal: boolean = false;
  selectedAppIdForReject: string | null = null;
  rejectionRemark: string = '';

  categories = [
    { label: 'Plastic', icon: 'PL', pct: 72, color: '#43a047' },
    { label: 'Organic', icon: 'OR', pct: 54, color: '#8bc34a' },
    { label: 'E-waste', icon: 'EW', pct: 38, color: '#26a69a' },
    { label: 'Paper', icon: 'PA', pct: 61, color: '#66bb6a' },
  ];

  activity = [
    { text: 'Plastic pickup completed', time: '2 days ago', dot: 'green' },
    { text: 'New opportunity nearby', time: '4 days ago', dot: 'blue' },
    { text: 'Profile updated', time: 'last week', dot: 'amber' },
  ];

  constructor(
    private auth: AuthService,
    private opportunityService: OpportunityService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {
    this.user = auth.getUser();
    this.role = this.user?.role || 'volunteer';
    this.greeting = this.greetingForRole(this.role);
    this.actions = this.actionsForRole(this.role);
  }

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading = true;

    this.opportunityService.getDashboardData().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.applications = res.data || [];

        if (this.role === 'ngo') {
          this.groupApplicationsByOpportunity();
        }

        const openOppsCount = this.role === 'ngo'
          ? Object.keys(this.groupedOpportunities).length
          : this.applications.length;

        this.stats = this.statsForRole(this.role, openOppsCount);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching dashboard summary data:', err);
        this.stats = this.statsForRole(this.role, 0);
        this.cdr.detectChanges();
      },
    });
  }

  groupApplicationsByOpportunity() {
    this.groupedOpportunities = {};

    // Group all applications for NGO review (including accepted and rejected)
    this.applications.forEach(app => {
      const oppId = app.opportunity_id?._id || 'unknown';
      if (!this.groupedOpportunities[oppId]) {
        this.groupedOpportunities[oppId] = {
          title: app.opportunity_id?.title || 'Opportunity Details',
          applications: []
        };
      }
      this.groupedOpportunities[oppId].applications.push(app);
    });
  }

  selectOpportunity(oppId: string) {
    this.selectedOpportunityId = this.selectedOpportunityId === oppId ? null : oppId;
  }

  acceptApplication(appId: string) {
    if (!confirm('Accept this volunteer application?')) return;

    this.opportunityService.updateApplicationStatus(appId, { status: 'accepted' }).subscribe({
      next: () => {
        this.toast.success('Application accepted');
        this.fetchDashboardData();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to accept application');
        console.error('Failed to accept application:', err);
      }
    });
  }

  openRejectModal(appId: string) {
    this.selectedAppIdForReject = appId;
    this.rejectionRemark = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedAppIdForReject = null;
    this.rejectionRemark = '';
  }

  confirmReject() {
    if (!this.selectedAppIdForReject) return;
    if (!confirm('Reject this volunteer application?')) return;

    this.opportunityService.updateApplicationStatus(this.selectedAppIdForReject, {
      status: 'rejected',
      rejection_remark: this.rejectionRemark
    }).subscribe({
      next: () => {
        this.toast.success('Application rejected');
        this.closeRejectModal();
        this.fetchDashboardData();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to reject application');
        console.error('Failed to reject application:', err);
      }
    });
  }

  get ObjectKeys(): string[] {
    return Object.keys(this.groupedOpportunities);
  }

  private greetingForRole(role: string) {
    if (role === 'admin') return 'Platform overview and controls at a glance.';
    if (role === 'ngo') return 'Manage your pickups, applications and volunteer opportunities.';
    return "Here's your recycling overview and application status.";
  }

  private statsForRole(role: string, metricCount: number = 0): Stat[] {
    if (role === 'admin') {
      return [
        { label: 'Total Applications', value: this.applications.length, icon: 'US', tint: '#e8f5e9', change: '8%', up: true },
        { label: 'System Opportunities', value: metricCount, icon: 'OP', tint: '#e3f2fd', change: '12%', up: true },
        { label: 'Pickups Done', value: 96, icon: 'PK', tint: '#f1f8e9', change: '5%', up: true },
        { label: 'Open Reports', value: 7, icon: 'RP', tint: '#fff3e0', change: '3%', up: false },
      ];
    }
    if (role === 'ngo') {
      return [
        { label: 'Active Opportunities', value: metricCount, icon: 'OP', tint: '#e8f5e9', change: '2', up: true },
        { label: 'Total Applicants', value: this.applications.length, icon: 'AP', tint: '#e3f2fd', change: '15%', up: true },
        { label: 'Pickups Done', value: 31, icon: 'PK', tint: '#f1f8e9', change: '9%', up: true },
        { label: 'Messages', value: 9, icon: 'MS', tint: '#fff3e0', change: '4', up: true },
      ];
    }
    return [
      { label: 'Total Pickups', value: 28, icon: 'PK', tint: '#e8f5e9', change: '7%', up: true },
      { label: 'Recycled Items', value: 635, icon: 'RC', tint: '#e3f2fd', change: '12%', up: true },
      { label: 'Applied Opportunities', value: this.applications.length, icon: 'OP', tint: '#f1f8e9', change: '3', up: true },
      { label: 'Messages', value: 5, icon: 'MS', tint: '#fff3e0', change: '1', up: false },
    ];
  }

  private actionsForRole(role: string): QuickAction[] {
    const editProfile: QuickAction = { label: 'Edit my profile', icon: 'ME', link: '/profile' };
    const browseOpportunities: QuickAction = { label: 'Browse opportunities', icon: 'OP', link: '/opportunities' };

    if (role === 'admin') {
      return [
        editProfile,
        browseOpportunities,
        { label: 'Manage pickups', icon: 'PK', link: '/pickups' },
        { label: 'Manage users', icon: 'AD', soon: true },
        { label: 'View reports', icon: 'RP', soon: true },
      ];
    }
    if (role === 'ngo') {
      return [
        editProfile,
        { label: 'Create opportunity', icon: 'ADD', link: '/opportunities/create' },
        { label: 'Manage pickups', icon: 'PK', link: '/pickups' },
        browseOpportunities,
      ];
    }
    return [
      editProfile,
      { label: 'Schedule a pickup', icon: 'PK', link: '/pickups' },
      { label: 'View my matches', icon: 'MT', link: '/match-suggestions' },
      browseOpportunities,
    ];
  }
}
~~~
## frontend/src/app/guards/auth.guard.ts

~~~typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
~~~
## frontend/src/app/interceptors/auth.interceptor.ts

~~~typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
~~~
## frontend/src/app/layout/shell.css

~~~css
.shell {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  background: var(--app-bg);
  overflow: hidden;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--green-dark);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 18px;
}
.brand-logo {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--green-light);
  border-radius: 12px;
  margin-bottom: 20px;
}
.user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.user-meta strong {
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-meta .role {
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: capitalize;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
  flex-shrink: 0;
}
.avatar.sm {
  width: 32px;
  height: 32px;
  font-size: 0.85rem;
}

.menu-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 6px 10px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 14px;
}
.menu a,
.menu .item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--ink);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}
.menu a:hover {
  background: var(--surface-hover);
}
.menu a.active {
  background: var(--green-light);
  color: var(--green-dark);
  font-weight: 600;
}
.menu .ic {
  font-size: 0.68rem;
  font-weight: 800;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}
.menu .label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.menu .item.soon {
  color: #9aa8a0;
  cursor: default;
}
.menu .item em {
  font-style: normal;
  font-size: 0.56rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #b26a00;
  background: var(--warning-bg);
  padding: 2px 6px;
  border-radius: 6px;
}

.logout {
  margin-top: auto;
  padding: 11px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink);
  font-weight: 500;
  cursor: pointer;
}
.logout:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.topbar {
  height: 64px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 22px;
  position: sticky;
  top: 0;
  z-index: 5;
}

.hamburger {
  display: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 7px 10px;
  cursor: pointer;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 9px 14px;
  flex: 1;
  max-width: 420px;
}
.search span {
  color: var(--muted);
  font-size: 0.8rem;
}
.search input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
  font-family: inherit;
}

.top-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}
.bell {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 7px 10px;
  cursor: pointer;
}
.theme-toggle {
  align-items: center;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--ink);
  cursor: pointer;
  display: inline-flex;
  min-height: 34px;
  padding: 6px 12px;
}
.chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 500;
}
.chip-name {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - 64px);
}

.backdrop {
  display: none;
}

@media (max-width: 860px) {
  .sidebar {
    position: fixed;
    z-index: 20;
    left: -270px;
    transition: left 0.25s ease;
  }
  .sidebar.open {
    left: 0;
  }
  .hamburger {
    display: block;
  }
  .backdrop.show {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 15;
  }
  .chip-name {
    display: none;
  }
}
~~~
## frontend/src/app/layout/shell.html

~~~html
<div class="shell">
  <aside class="sidebar" [class.open]="sidebarOpen">
    <div class="brand">
      <span class="brand-logo">WZ</span> WasteZero
    </div>

    <div class="user-card">
      <div class="avatar">{{ initial }}</div>
      <div class="user-meta">
        <strong>{{ user?.name }}</strong>
        <span class="role">{{ user?.role }}</span>
      </div>
    </div>

    <p class="menu-label">Main Menu</p>
    <nav class="menu">
      <a routerLink="/dashboard" routerLinkActive="active" (click)="sidebarOpen = false">
        <span class="ic">DB</span>
        <span class="label">Dashboard</span>
      </a>

      <!-- NEW APPLICATIONS SIDEBAR MENU ITEM -->
      <a routerLink="/applications" routerLinkActive="active" (click)="sidebarOpen = false">
        <span class="ic">AP</span>
        <span class="label">Applications</span>
      </a>

      <a routerLink="/pickups" routerLinkActive="active" (click)="sidebarOpen = false">
        <span class="ic">PK</span>
        <span class="label">{{ user?.role === 'volunteer' ? 'Schedule Pickup' : 'Pickup Management' }}</span>
      </a>

      <a routerLink="/opportunities" routerLinkActive="active" (click)="sidebarOpen = false">
        <span class="ic">OP</span>
        <span class="label">Opportunities</span>
      </a>
      <a routerLink="/messages" routerLinkActive="active" (click)="sidebarOpen = false">
        <span class="ic">MS</span>
        <span class="label">Messages</span>
      </a>
      @if (user?.role === 'volunteer') {
        <a routerLink="/match-suggestions" routerLinkActive="active" (click)="sidebarOpen = false">
          <span class="ic">MT</span>
          <span class="label">My Matches</span>
        </a>
      }
      <span class="item soon">
        <span class="ic">IM</span>
        <span class="label">My Impact</span>
        <em>soon</em>
      </span>
    </nav>

    <p class="menu-label">Settings</p>
    <nav class="menu">
      <a routerLink="/profile" routerLinkActive="active" (click)="sidebarOpen = false">
        <span class="ic">PR</span>
        <span class="label">My Profile</span>
      </a>
      <span class="item soon">
        <span class="ic">ST</span>
        <span class="label">Settings</span>
        <em>soon</em>
      </span>
      <span class="item soon">
        <span class="ic">HP</span>
        <span class="label">Help &amp; Support</span>
        <em>soon</em>
      </span>
      <span class="item soon">
        <span class="ic">AD</span>
        <span class="label">Admin Panel</span>
        <em>soon</em>
      </span>
    </nav>

    <button class="logout" (click)="logout()">Logout</button>
  </aside>

  <div class="backdrop" [class.show]="sidebarOpen" (click)="sidebarOpen = false"></div>

  <div class="main">
    <header class="topbar">
      <button class="hamburger" (click)="sidebarOpen = !sidebarOpen">Menu</button>
      <div class="search">
        <span>Search</span>
        <input placeholder="Search pickups, opportunities..." [(ngModel)]="searchQuery" (keyup.enter)="onNavSearch()" />
      </div>
      <div class="top-right">
        <button class="theme-toggle" type="button" (click)="toggleTheme()" [attr.aria-label]="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <strong>{{ theme === 'dark' ? 'Light' : 'Dark' }}</strong>
        </button>
        <a class="bell" routerLink="/notifications" aria-label="Notifications">Alerts</a>
        <div class="chip">
          <div class="avatar sm">{{ initial }}</div>
          <span class="chip-name">{{ user?.name }}</span>
        </div>
      </div>
    </header>

    <main class="content">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
~~~
## frontend/src/app/layout/shell.ts

~~~typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AppTheme, ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  user: any;
  sidebarOpen = false;
  searchQuery = '';
  theme: AppTheme = 'light';

  constructor(
    public auth: AuthService,
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.user = this.auth.getUser();
    this.theme = this.themeService.theme;
  }

  get initial() {
    return (this.user?.name || '?').charAt(0).toUpperCase();
  }

  get roleLabel(): string {
    const role = this.user?.role || '';
    if (role === 'admin') return 'Admin';
    if (role === 'ngo') return 'NGO';
    return 'Volunteer';
  }

  onNavSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/opportunities'], {
        queryParams: { search: this.searchQuery.trim() }
      });
      this.searchQuery = '';
    }
  }

  toggleTheme() {
    this.theme = this.themeService.toggle();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
~~~
## frontend/src/app/match-suggestions/match-suggestions.css

~~~css
.page header { margin-bottom: 22px; }
.eyebrow { color: #218a4a; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }
h1 { margin: 4px 0; font-size: 32px; }
header p:last-child { color: #6b7b72; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 16px; }
article { position: relative; padding: 22px; background: var(--surface, white); border: 1px solid #dce7df; border-radius: 16px; }
article h2 { padding-right: 90px; margin: 0 0 8px; font-size: 20px; }
article > p { color: #66766c; min-height: 44px; }
.score { position: absolute; right: 16px; top: 16px; padding: 6px 9px; border-radius: 20px; background: #fff4dc; color: #8b5b00; font-size: 12px; font-weight: 800; }
.score.strong { background: #dff5e6; color: #176b39; }
dl div { display: flex; justify-content: space-between; gap: 10px; margin: 7px 0; }
dt { color: #66766c; } dd { margin: 0; text-align: right; font-weight: 700; }
.reasons { display: flex; gap: 6px; flex-wrap: wrap; margin: 16px 0; }
.reasons span { padding: 5px 8px; border-radius: 7px; background: #eef5f0; color: #315c40; font-size: 12px; }
article a { display: block; text-align: center; text-decoration: none; padding: 10px; border-radius: 9px; background: #238b4b; color: white; font-weight: 800; }
.empty, .error { padding: 28px; border-radius: 14px; background: white; color: #66766c; text-align: center; }
.error { color: #b42318; background: #fee4e2; }
~~~
## frontend/src/app/match-suggestions/match-suggestions.html

~~~html
<section class="page">
  <header>
    <p class="eyebrow">Smart matching</p>
    <h1>Recommended opportunities</h1>
    <p>Suggestions are ranked using your preferred waste types, skills, and location.</p>
  </header>

  @if (loading) { <div class="empty">Finding your best matches...</div> }
  @if (error) { <div class="error">{{ error }}</div> }
  @if (!loading && !error && !matches.length) {
    <div class="empty">No open opportunities are available. Complete your profile and check again soon.</div>
  }

  <div class="grid">
    @for (match of matches; track match.opportunity._id) {
      <article>
        <div class="score" [class.strong]="match.score >= 60">{{ match.score }}% match</div>
        <h2>{{ match.opportunity.title }}</h2>
        <p>{{ match.opportunity.description }}</p>
        <dl>
          <div><dt>NGO</dt><dd>{{ match.opportunity.ngo_id?.name || 'WasteZero partner' }}</dd></div>
          <div><dt>Location</dt><dd>{{ match.opportunity.location }}</dd></div>
        </dl>
        <div class="reasons">
          @for (reason of match.reasons; track reason) { <span>{{ reason }}</span> }
          @if (!match.reasons.length) { <span>New opportunity</span> }
        </div>
        <a [routerLink]="['/opportunities', match.opportunity._id]">View opportunity</a>
      </article>
    }
  </div>
</section>
~~~
## frontend/src/app/match-suggestions/match-suggestions.ts

~~~typescript
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatchingService, OpportunityMatch } from '../services/matching.service';

@Component({
  selector: 'app-match-suggestions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './match-suggestions.html',
  styleUrl: './match-suggestions.css',
})
export class MatchSuggestions implements OnInit {
  matches: OpportunityMatch[] = [];
  loading = true;
  error = '';

  constructor(private matching: MatchingService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.matching.getSuggestions().subscribe({
      next: (matches) => {
        this.matches = matches;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load match suggestions';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
~~~
## frontend/src/app/messages/messages.css

~~~css
.page header { margin-bottom: 22px; }
.eyebrow { color: #218a4a; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }
h1 { margin: 4px 0; font-size: 32px; }
header p:last-child, .muted { color: #6b7b72; }
.error { margin-bottom: 12px; padding: 12px; border-radius: 10px; color: #b42318; background: #fee4e2; }
.messenger { display: grid; grid-template-columns: 280px 1fr; min-height: 620px; background: var(--surface, #fff); border: 1px solid #dce7df; border-radius: 18px; overflow: hidden; }
.contacts { padding: 18px; border-right: 1px solid #dce7df; }
.contacts h2 { margin: 0 0 14px; font-size: 17px; }
.contacts button { width: 100%; display: flex; gap: 10px; align-items: center; border: 0; background: transparent; padding: 11px; border-radius: 12px; text-align: left; cursor: pointer; color: inherit; }
.contacts button:hover, .contacts button.active { background: #e9f7ee; }
.contacts small { display: block; margin-top: 3px; color: #6b7b72; }
.avatar { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: #248c4c; color: white; font-weight: 800; flex: none; }
.conversation { min-width: 0; display: flex; flex-direction: column; }
.conversation-head { padding: 18px 22px; border-bottom: 1px solid #dce7df; display: flex; justify-content: space-between; }
.conversation-head span { color: #6b7b72; text-transform: capitalize; }
.thread { flex: 1; padding: 22px; overflow: auto; display: flex; flex-direction: column; gap: 10px; background: #f6faf7; }
.bubble { max-width: 72%; align-self: flex-start; background: white; padding: 11px 14px; border-radius: 14px 14px 14px 4px; box-shadow: 0 2px 8px #153d2212; }
.bubble.mine { align-self: flex-end; background: #238b4b; color: white; border-radius: 14px 14px 4px 14px; }
.bubble p { margin: 0 0 6px; white-space: pre-wrap; }
.bubble small { opacity: .7; }
.composer { padding: 14px; display: flex; gap: 10px; border-top: 1px solid #dce7df; }
.composer input { flex: 1; border: 1px solid #cddbd1; border-radius: 10px; padding: 12px 14px; }
.composer button { border: 0; border-radius: 10px; background: #238b4b; color: white; padding: 0 24px; font-weight: 800; }
.composer button:disabled { opacity: .5; }
.empty, .empty-state { margin: auto; color: #6b7b72; text-align: center; }
@media (max-width: 760px) { .messenger { grid-template-columns: 1fr; } .contacts { border-right: 0; border-bottom: 1px solid #dce7df; max-height: 230px; overflow: auto; } }
~~~
## frontend/src/app/messages/messages.html

~~~html
<section class="page">
  <header>
    <p class="eyebrow">Communication</p>
    <h1>Messages</h1>
    <p>Chat with NGOs and volunteers in real time.</p>
  </header>

  @if (error) { <div class="error">{{ error }}</div> }

  <div class="messenger">
    <aside class="contacts">
      <h2>Contacts</h2>
      @if (loading) {
        <p class="muted">Loading contacts...</p>
      } @else if (!contacts.length) {
        <p class="muted">No contacts are available yet.</p>
      }
      @for (contact of contacts; track contact._id) {
        <button type="button" [class.active]="selectedContact?._id === contact._id" (click)="selectContact(contact)">
          <span class="avatar">{{ contact.name.charAt(0).toUpperCase() }}</span>
          <span><strong>{{ contact.name }}</strong><small>{{ contact.role }} · {{ contact.location || 'Location not set' }}</small></span>
        </button>
      }
    </aside>

    <div class="conversation">
      @if (selectedContact) {
        <div class="conversation-head">
          <strong>{{ selectedContact.name }}</strong>
          <span>{{ selectedContact.role }}</span>
        </div>
        <div class="thread">
          @if (!messages.length) { <p class="empty">Start the conversation with {{ selectedContact.name }}.</p> }
          @for (message of messages; track message._id) {
            <div class="bubble" [class.mine]="isMine(message)">
              <p>{{ message.content }}</p>
              <small>{{ message.createdAt | date:'short' }}</small>
            </div>
          }
        </div>
        <form class="composer" (ngSubmit)="send()">
          <input name="draft" [(ngModel)]="draft" maxlength="2000" placeholder="Write a message..." autocomplete="off" />
          <button type="submit" [disabled]="!draft.trim()">Send</button>
        </form>
      } @else {
        <div class="empty-state">Choose a contact to begin messaging.</div>
      }
    </div>
  </div>
</section>
~~~
## frontend/src/app/messages/messages.ts

~~~typescript
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { RealtimeService } from '../services/realtime.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit, OnDestroy {
  contacts: any[] = [];
  messages: any[] = [];
  selectedContact: any;
  currentUser: any;
  draft = '';
  loading = true;
  error = '';
  private subscription?: Subscription;

  constructor(
    private messageService: MessageService,
    private realtime: RealtimeService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentUser = this.auth.getUser();
  }

  ngOnInit() {
    this.realtime.connect();
    this.loadContacts();
    this.subscription = this.realtime.messages$.subscribe((message) => {
      const senderId = message.sender_id?._id || message.sender_id;
      if (this.selectedContact?._id === senderId) this.messages.push(message);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadContacts() {
    this.messageService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.loading = false;
        const requestedId = this.route.snapshot.queryParamMap.get('contact');
        const initial = contacts.find((contact) => contact._id === requestedId) || contacts[0];
        if (initial) this.selectContact(initial);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load contacts';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  selectContact(contact: any) {
    this.selectedContact = contact;
    this.messages = [];
    this.messageService.getConversation(contact._id).subscribe({
      next: (result) => {
        this.messages = result.messages || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load conversation';
        this.cdr.detectChanges();
      },
    });
  }

  send() {
    const content = this.draft.trim();
    if (!content || !this.selectedContact) return;
    this.draft = '';
    this.messageService.send(this.selectedContact._id, content).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Message could not be sent';
        this.draft = content;
        this.cdr.detectChanges();
      },
    });
  }

  isMine(message: any) {
    return (message.sender_id?._id || message.sender_id) === this.currentUser?._id;
  }
}
~~~
## frontend/src/app/notifications/notifications.css

~~~css
.page header { display: flex; justify-content: space-between; align-items: end; margin-bottom: 22px; }
.eyebrow { color: #218a4a; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }
h1 { margin: 4px 0; font-size: 32px; }
header p:last-child { color: #6b7b72; }
header button { border: 0; background: #238b4b; color: white; padding: 10px 14px; border-radius: 10px; font-weight: 700; }
.list { background: var(--surface, white); border: 1px solid #dce7df; border-radius: 18px; overflow: hidden; }
.notice { width: 100%; display: flex; gap: 14px; align-items: flex-start; border: 0; border-bottom: 1px solid #e3ece6; padding: 18px 20px; background: transparent; text-align: left; color: inherit; cursor: pointer; }
.notice:last-child { border-bottom: 0; }
.notice.unread { background: #eef9f1; }
.dot { width: 9px; height: 9px; margin-top: 6px; border-radius: 50%; background: transparent; flex: none; }
.unread .dot { background: #238b4b; }
.copy { display: grid; gap: 4px; }
.copy span, .copy small { color: #66766c; }
.empty { padding: 35px; text-align: center; color: #66766c; }
~~~
## frontend/src/app/notifications/notifications.html

~~~html
<section class="page">
  <header>
    <div>
      <p class="eyebrow">Updates</p>
      <h1>Notifications</h1>
      <p>{{ unread }} unread notification{{ unread === 1 ? '' : 's' }}</p>
    </div>
    @if (unread) { <button type="button" (click)="markAllRead()">Mark all read</button> }
  </header>

  <div class="list">
    @if (loading) {
      <p class="empty">Loading notifications...</p>
    } @else if (!notifications.length) {
      <p class="empty">You do not have any notifications yet.</p>
    }
    @for (notification of notifications; track notification._id) {
      <button type="button" class="notice" [class.unread]="!notification.read_at" (click)="open(notification)">
        <span class="dot"></span>
        <span class="copy">
          <strong>{{ notification.title }}</strong>
          <span>{{ notification.message }}</span>
          <small>{{ notification.createdAt | date:'medium' }}</small>
        </span>
      </button>
    }
  </div>
</section>
~~~
## frontend/src/app/notifications/notifications.ts

~~~typescript
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { RealtimeService } from '../services/realtime.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit, OnDestroy {
  notifications: any[] = [];
  unread = 0;
  loading = true;
  private subscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private realtime: RealtimeService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.realtime.connect();
    this.load();
    this.subscription = this.realtime.notifications$.subscribe(() => this.load());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  load() {
    this.notificationService.getAll().subscribe({
      next: (result) => {
        this.notifications = result.notifications;
        this.unread = result.unread;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  open(notification: any) {
    const navigate = () => notification.link && this.router.navigateByUrl(notification.link);
    if (notification.read_at) return navigate();
    this.notificationService.markRead(notification._id).subscribe({
      next: navigate,
      error: navigate,
    });
  }

  markAllRead() {
    this.notificationService.markAllRead().subscribe(() => this.load());
  }
}
~~~
## frontend/src/app/opportunities/create-opportunity/create-opportunity.css

~~~css
.form-page {
    max-width: 820px;
    margin: 0 auto;
    padding: 8px 0;
}

.back-btn {
    background: none;
    border: none;
    color: var(--green-dark);
    cursor: pointer;
    font-size: 0.88rem;
    padding: 0;
    margin-bottom: 16px;
    font-family: inherit;
}

.form-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 4px;
    color: var(--ink);
}

.form-sub {
    font-size: 0.82rem;
    color: var(--muted);
    margin: 0 0 20px;
}

.alert.error {
    background: #fdecea;
    color: var(--danger);
    border: 1px solid #f5c6c2;
    padding: 10px 14px;
    border-radius: 9px;
    font-size: 0.85rem;
    margin-bottom: 16px;
}

.form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    box-shadow: var(--shadow-sm);
}

.field {
    margin-bottom: 16px;
}

.field label {
    display: block;
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.field input,
.field textarea {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    font-size: 0.92rem;
    font-family: inherit;
    background: var(--input-bg);
    box-sizing: border-box;
}

.field input:focus,
.field textarea:focus {
    outline: none;
    border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
    background: var(--surface);
}

.field textarea {
    resize: vertical;
    min-height: 90px;
}

.row {
    display: flex;
    gap: 16px;
}

.row .field {
    flex: 1;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 8px;
}

.btn-cancel {
    padding: 10px 22px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--surface);
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
}

.btn-submit {
    padding: 10px 24px;
    background: linear-gradient(135deg, #3da35b, #175d35);
    color: #fff;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    font-family: inherit;
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 680px) {
    .row,
    .form-actions {
        flex-direction: column;
    }
}
~~~
## frontend/src/app/opportunities/create-opportunity/create-opportunity.html

~~~html
<div class="form-page">
  <button class="back-btn" [routerLink]="['/opportunities']">Back</button>
  <h2 class="form-title">Create New Opportunity</h2>
  <p class="form-sub">Post a volunteer opportunity for waste management and recycling</p>

  @if (error) { <div class="alert error">{{ error }}</div> }

  <div class="form-card">
    <form [formGroup]="form" (ngSubmit)="createOpportunity()">
      <div class="field">
        <label>Title *</label>
        <input formControlName="title" placeholder="E.g., Beach Cleanup Drive" />
      </div>
      <div class="field">
        <label>Description *</label>
        <textarea formControlName="description" rows="4" placeholder="Provide details about the opportunity"></textarea>
      </div>
      <div class="row">
        <div class="field">
          <label>Date</label>
          <input formControlName="date" type="date" />
        </div>
        <div class="field">
          <label>Duration</label>
          <input formControlName="duration" placeholder="E.g., 4 hours" />
        </div>
      </div>
      <div class="field">
        <label>Location *</label>
        <input formControlName="location" placeholder="E.g., Brighton Beach, Boston" />
      </div>
      <div class="field">
        <label>Required Skills</label>
        <input formControlName="required_skills" placeholder="teamwork, recycling (comma separated)" />
      </div>
      <div class="field">
        <label>Waste Types</label>
        <input formControlName="waste_types" placeholder="plastic, organic, e-waste (comma separated)" />
        <small>Used to match this opportunity with interested volunteers.</small>
      </div>
      <div class="field">
        <label>Opportunity Image (Optional)</label>

        <input type="file" accept="image/*" (change)="onFileSelected($event)" />

        @if (selectedFile) {
        <small class="file-name">
          Selected: {{ selectedFile.name }}
        </small>
        }
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" routerLink="/opportunities">Cancel</button>
        <button type="submit" class="btn-submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Creating...' : 'Create Opportunity' }}
        </button>
      </div>
    </form>
  </div>
</div>
~~~
## frontend/src/app/opportunities/create-opportunity/create-opportunity.ts

~~~typescript
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-create-opportunity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-opportunity.html',
  styleUrl: './create-opportunity.css',
})
export class CreateOpportunity {
  form: FormGroup;
  loading = false;
  error = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private opportunityService: OpportunityService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      required_skills: [''],
      waste_types: [''],
      duration: [''],
      location: ['', Validators.required],
      date: [''],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  createOpportunity() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const val = this.form.value;
    const formData = new FormData();

    formData.append('title', val.title);
    formData.append('description', val.description);
    formData.append('location', val.location);
    formData.append('duration', val.duration || '');
    formData.append('date', val.date || '');

    formData.append(
      'required_skills',
      JSON.stringify(
        val.required_skills
          ? val.required_skills
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      ),
    );
    formData.append(
      'waste_types',
      JSON.stringify(
        val.waste_types
          ? val.waste_types.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      ),
    );

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.opportunityService.create(formData).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/opportunities']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create opportunity';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
~~~
## frontend/src/app/opportunities/edit-opportunity/edit-opportunity.css

~~~css
.form-page {
    max-width: 820px;
    margin: 0 auto;
    padding: 8px 0;
}

.back-btn {
    background: none;
    border: none;
    color: var(--green-dark);
    cursor: pointer;
    font-size: 0.88rem;
    padding: 0;
    margin-bottom: 16px;
    font-family: inherit;
}

.form-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 4px;
    color: var(--ink);
}

.form-sub {
    font-size: 0.82rem;
    color: var(--muted);
    margin: 0 0 20px;
}

.alert.error {
    background: #fdecea;
    color: var(--danger);
    border: 1px solid #f5c6c2;
    padding: 10px 14px;
    border-radius: 9px;
    font-size: 0.85rem;
    margin-bottom: 16px;
}

.state-msg {
    text-align: center;
    color: var(--muted);
    margin: 40px 0;
}

.form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    box-shadow: var(--shadow-sm);
}

.field {
    margin-bottom: 16px;
}

.field label {
    display: block;
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.field input,
.field textarea,
.field select {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    font-size: 0.92rem;
    font-family: inherit;
    background: var(--input-bg);
    box-sizing: border-box;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
    outline: none;
    border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
    background: var(--surface);
}

.field textarea {
    resize: vertical;
    min-height: 90px;
}

.row {
    display: flex;
    gap: 16px;
}

.row .field {
    flex: 1;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 8px;
}

.btn-cancel {
    padding: 10px 22px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--surface);
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
}

.btn-submit {
    padding: 10px 24px;
    background: linear-gradient(135deg, #3da35b, #175d35);
    color: #fff;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    font-family: inherit;
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.current-img {
  margin-bottom: 10px;
}

.current-img img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 9px;
  border: 1px solid var(--border);
}

.current-img small {
  display: block;
  margin-top: 5px;
  font-size: 0.76rem;
  color: var(--muted);
}

.file-name {
  display: block;
  margin-top: 5px;
  font-size: 0.76rem;
  color: var(--green-dark);
}

@media (max-width: 680px) {
    .row,
    .form-actions {
        flex-direction: column;
    }
}
~~~
## frontend/src/app/opportunities/edit-opportunity/edit-opportunity.html

~~~html
<div class="form-page">
  <button class="back-btn" [routerLink]="['/opportunities']">Back to Opportunities</button>
  <h2 class="form-title">Edit Opportunity</h2>
  <p class="form-sub">Update the details of this volunteer opportunity</p>

  @if (fetching) {
    <p class="state-msg">Loading...</p>
  }

  @if (error) {
    <div class="alert error">{{ error }}</div>
  }

  @if (!fetching) {
    <div class="form-card">
      <form [formGroup]="form" (ngSubmit)="updateOpportunity()">

        <div class="field">
          <label>Title *</label>
          <input formControlName="title" placeholder="E.g., Beach Cleanup Drive" />
        </div>

        <div class="field">
          <label>Description *</label>
          <textarea formControlName="description" rows="4"
            placeholder="Provide details about the opportunity"></textarea>
        </div>

        <div class="row">
          <div class="field">
            <label>Date</label>
            <input formControlName="date" type="date" />
          </div>
          <div class="field">
            <label>Duration</label>
            <input formControlName="duration" placeholder="E.g., 4 hours" />
          </div>
        </div>

        <div class="field">
          <label>Location *</label>
          <input formControlName="location" placeholder="E.g., Brighton Beach, Boston" />
        </div>

        <div class="field">
          <label>Required Skills</label>
          <input formControlName="required_skills"
            placeholder="teamwork, recycling (comma separated)" />
        </div>

        <div class="field">
          <label>Waste Types</label>
          <input formControlName="waste_types"
            placeholder="plastic, organic, e-waste (comma separated)" />
          <small>Used by volunteer match suggestions.</small>
        </div>

        <div class="field">
          <label>Status</label>
          <select formControlName="status">
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div class="field">
          <label>Opportunity Image</label>

          @if (currentImageUrl && !selectedFile) {
            <div class="current-img">
              <img [src]="currentImageUrl" alt="Current image" />
              <small>Current image - upload a new one to replace it</small>
            </div>
          }

          <input type="file" accept="image/*" (change)="onFileSelected($event)" />

          @if (selectedFile) {
            <small class="file-name">New image selected: {{ selectedFile.name }}</small>
          }
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" [routerLink]="['/opportunities']">
            Cancel
          </button>
          <button type="submit" class="btn-submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

      </form>
    </div>
  }
</div>
~~~
## frontend/src/app/opportunities/edit-opportunity/edit-opportunity.ts

~~~typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-edit-opportunity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-opportunity.html',
  styleUrl: './edit-opportunity.css',
})
export class EditOpportunity implements OnInit {
  form: FormGroup;
  loading = false;
  fetching = true;
  error = '';
  id = '';
  selectedFile: File | null = null;
  currentImageUrl = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private opportunityService: OpportunityService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      required_skills: [''],
      waste_types: [''],
      duration: [''],
      location: ['', Validators.required],
      date: [''],
      status: ['open'],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.opportunityService.getById(this.id).subscribe({
      next: (opp) => {
        this.currentImageUrl = opp.image_url || '';
        this.form.patchValue({
          title: opp.title,
          description: opp.description,
          required_skills: (opp.required_skills || []).join(', '),
          waste_types: (opp.waste_types || []).join(', '),
          duration: opp.duration || '',
          location: opp.location || '',
          date: opp.date ? opp.date.slice(0, 10) : '',
          status: opp.status,
        });
        this.fetching = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load opportunity';
        this.fetching = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateOpportunity() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const val = this.form.value;
    const formData = new FormData();

    formData.append('title', val.title || '');
    formData.append('description', val.description || '');
    formData.append('location', val.location || '');
    formData.append('duration', val.duration || '');
    formData.append('date', val.date || '');
    formData.append('status', val.status || '');
    formData.append(
      'required_skills',
      JSON.stringify(
        val.required_skills
          ? val.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      ),
    );
    formData.append(
      'waste_types',
      JSON.stringify(
        val.waste_types
          ? val.waste_types.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      ),
    );

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.opportunityService.update(this.id, formData).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/opportunities']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update opportunity';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
~~~
## frontend/src/app/opportunities/opportunity-detail/opportunity-detail.css

~~~css
.detail-page {
  max-width: 1180px;
  margin: 0 auto;
}

.back-link {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--green-dark);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 700;
  gap: 7px;
  margin-bottom: 18px;
  padding: 0;
}

.back-link::before {
  content: "<";
  font-size: 1rem;
}

.detail-head {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 20px;
}

.detail-head h1 {
  color: var(--ink);
  font-size: 1.55rem;
  line-height: 1.2;
  margin: 0 0 4px;
}

.detail-head p {
  color: var(--muted);
  font-size: 0.84rem;
  margin: 0;
}

.status {
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 6px 12px;
  text-transform: capitalize;
}

.status.open {
  background: #e6f6ed;
  color: #167a3c;
}

.status.closed {
  background: #fdecea;
  color: var(--danger);
}

.status.in-progress {
  background: #fff4df;
  color: #aa5a00;
}

.detail-grid {
  display: grid;
  gap: 22px;
  grid-template-columns: minmax(0, 1fr) 340px;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.hero-image {
  aspect-ratio: 16 / 6;
  background: #dde7e1;
  border-radius: 14px;
  border: 1px solid var(--border);
  display: block;
  object-fit: cover;
  overflow: hidden;
  width: 100%;
}

.hero-image.placeholder {
  align-items: center;
  background:
    linear-gradient(135deg, rgba(22, 52, 31, 0.78), rgba(46, 125, 50, 0.5)),
    url('/recycle-hero.jpg') center / cover no-repeat;
  color: #fff;
  display: flex;
  font-size: 1.2rem;
  font-weight: 800;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.panel,
.details-card,
.state-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
}

.panel {
  padding: 24px;
}

.panel h2,
.details-card h2 {
  color: var(--ink);
  font-size: 1.02rem;
  margin: 0 0 14px;
}

.panel p {
  color: var(--ink);
  font-size: 0.92rem;
  line-height: 1.7;
  margin: 0;
}

.panel-title-row {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel-title-row h2 {
  margin-bottom: 4px;
}

.panel-title-row p {
  color: var(--muted);
  font-size: 0.84rem;
}

.muted {
  color: var(--muted) !important;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.skill-list span {
  background: #f1f6f2;
  border: 1px solid #dde9e0;
  border-radius: 999px;
  color: #284235;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 6px 10px;
}

.details-card {
  align-self: start;
  padding: 24px;
  position: sticky;
  top: 86px;
}

.applications-panel {
  overflow: hidden;
}

.application-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.application-summary span,
.application-status {
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 800;
  padding: 6px 10px;
  text-transform: capitalize;
}

.application-summary span {
  background: color-mix(in srgb, var(--green) 10%, var(--surface));
  border: 1px solid var(--border);
  color: var(--green-dark);
}

.application-status.pending {
  background: #fff4df;
  color: #9a5200;
}

.application-status.accepted {
  background: #e6f6ed;
  color: #13733a;
}

.application-status.rejected {
  background: #fdecea;
  color: #b42318;
}

.details-card > .application-status {
  display: block;
  line-height: 1.45;
  margin: 16px 0 12px;
  text-align: center;
}

.details-card > .application-status small {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  margin-top: 4px;
  opacity: 0.82;
}

.application-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.application-item {
  align-items: flex-start;
  background: color-mix(in srgb, var(--surface) 86%, var(--green) 4%);
  border: 1px solid var(--border);
  border-radius: 14px;
  display: grid;
  gap: 14px;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  padding: 14px;
}

.applicant-avatar {
  align-items: center;
  background: linear-gradient(135deg, #3da35b, #17462b);
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 0.95rem;
  font-weight: 900;
  height: 42px;
  justify-content: center;
  width: 42px;
}

.status-avatar {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--green-dark);
}

.applicant-info {
  min-width: 0;
}

.applicant-head {
  align-items: flex-start;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.applicant-head strong {
  color: var(--ink);
  display: block;
  font-size: 0.94rem;
  margin-bottom: 2px;
}

.applicant-head p,
.applicant-meta {
  color: var(--muted);
  font-size: 0.8rem;
}

.applicant-head p {
  margin: 0;
  overflow-wrap: anywhere;
}

.applicant-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.mini-skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.mini-skill-list span {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--ink);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 5px 8px;
}

.application-actions {
  display: flex;
  gap: 8px;
}

.remark-box {
  background: #fdecea;
  border: 1px solid #f4b4ae;
  border-radius: 8px;
  color: #b42318;
  font-size: 0.82rem;
  padding: 8px 12px;
  margin-top: 8px;
  line-height: 1.4;
}

.detail-item {
  display: grid;
  gap: 10px;
  grid-template-columns: 28px 1fr;
  margin-bottom: 18px;
}

.meta-icon {
  align-items: center;
  background: #f2f6f4;
  border: 1px solid var(--border);
  border-radius: 7px;
  color: #17462b;
  display: flex;
  font-size: 0.7rem;
  font-weight: 800;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.detail-item strong {
  display: block;
  font-size: 0.78rem;
  margin-bottom: 2px;
}

.detail-item p,
.detail-item small {
  color: var(--muted);
  display: block;
  font-size: 0.82rem;
  margin: 0;
}

.action-row {
  border-top: 1px solid var(--border);
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  padding-top: 16px;
}

.btn-edit,
.btn-delete,
.btn-apply,
.btn-refresh,
.btn-accept,
.btn-reject,
.btn-cancel,
.btn-confirm-reject {
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 800;
  padding: 10px 14px;
}

.btn-edit {
  background: #fff;
  border: 1px solid var(--border);
  color: var(--ink);
}

.btn-delete {
  background: #ef4444;
  border: 1px solid #ef4444;
  color: #fff;
}

.btn-apply {
  background: linear-gradient(135deg, #3da35b, #175d35);
  border: none;
  color: #fff;
  width: 100%;
}

.btn-refresh {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--ink);
  white-space: nowrap;
}

.btn-accept {
  background: #178348;
  border: 1px solid #178348;
  color: #fff;
}

.btn-reject {
  background: var(--surface);
  border: 1px solid #ef4444;
  color: #d92d20;
}

.btn-delete:disabled,
.btn-apply:disabled,
.btn-refresh:disabled,
.btn-accept:disabled,
.btn-reject:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.inline-error {
  background: #fdecea;
  border: 1px solid #f4b4ae;
  border-radius: 10px;
  color: #b42318;
  font-size: 0.84rem;
  font-weight: 700;
  margin-bottom: 14px;
  padding: 10px 12px;
}

.side-note {
  border-top: 1px solid var(--border);
  font-size: 0.84rem;
  line-height: 1.5;
  margin-top: 16px !important;
  padding-top: 16px;
}

.state-card {
  color: var(--muted);
  padding: 42px 24px;
  text-align: center;
}

.state-card.error {
  color: var(--danger);
}

/* REJECTION REMARK MODAL OVERLAY */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  width: 440px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  color: var(--ink);
  font-size: 1.15rem;
  margin: 0 0 8px;
}

.modal-content p {
  color: var(--muted);
  font-size: 0.86rem;
  margin: 0 0 14px;
}

.modal-content textarea {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--ink);
  font-family: inherit;
  font-size: 0.88rem;
  padding: 12px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;
}

.btn-cancel {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--ink);
}

.btn-confirm-reject {
  background: #ef4444;
  border: 1px solid #ef4444;
  color: #fff;
}

@media (max-width: 920px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .details-card {
    position: static;
  }

  .hero-image {
    aspect-ratio: 16 / 8;
  }

  .application-item {
    grid-template-columns: 42px minmax(0, 1fr);
  }

  .application-actions {
    grid-column: 2;
  }
}

@media (max-width: 560px) {
  .detail-head {
    flex-direction: column;
  }

  .panel,
  .details-card {
    padding: 18px;
  }

  .panel-title-row,
  .applicant-head {
    flex-direction: column;
  }

  .application-item {
    grid-template-columns: 1fr;
  }

  .applicant-avatar,
  .application-actions {
    grid-column: auto;
  }

  .application-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
}
~~~
## frontend/src/app/opportunities/opportunity-detail/opportunity-detail.html

~~~html
<div class="detail-page">
  <button class="back-link" routerLink="/opportunities">Back to Opportunities</button>

  @if (loading) {
    <div class="state-card">Loading opportunity...</div>
  }

  @if (!loading && error) {
    <div class="state-card error">{{ error }}</div>
  }

  @if (!loading && opportunity) {
    <section class="detail-head">
      <div>
        <h1>{{ opportunity.title }}</h1>
        <p>Volunteer opportunity details</p>
      </div>
      <span [class]="statusClass(opportunity.status)">{{ opportunity.status }}</span>
    </section>

    <section class="detail-grid">
      <div class="main-column">
        <img class="hero-image" [src]="imageFor(opportunity)" [alt]="opportunity.title" />

        <article class="panel">
          <h2>Description</h2>
          <p>{{ opportunity.description }}</p>
        </article>

        <article class="panel">
          <h2>Required Skills</h2>
          @if (opportunity.required_skills.length) {
            <div class="skill-list">
              @for (skill of opportunity.required_skills; track skill) {
                <span>{{ skill }}</span>
              }
            </div>
          } @else {
            <p class="muted">No specific skills required.</p>
          }
        </article>

        @if (canViewApplicationStatus) {
          <article class="panel applications-panel">
            <div class="panel-title-row">
              <div>
                <h2>Volunteer Applications</h2>
                @if (canReviewApplications) {
                  <p>Review applicants for this opportunity.</p>
                } @else {
                  <p>Read-only status overview for this opportunity.</p>
                }
              </div>
              <button class="btn-refresh" type="button" [disabled]="applicationsLoading" (click)="loadApplications()">
                {{ applicationsLoading ? 'Refreshing...' : 'Refresh' }}
              </button>
            </div>

            <div class="application-summary">
              <span>{{ applicationSummary.total }} total</span>
              <span>{{ pendingCount }} pending</span>
              <span>{{ acceptedCount }} accepted</span>
              <span>{{ rejectedCount }} rejected</span>
            </div>

            @if (applicationsError) {
              <div class="inline-error">{{ applicationsError }}</div>
            }

            @if (applicationsLoading && applications.length === 0) {
              <p class="muted">Loading applications...</p>
            }

            @if (!applicationsLoading && applications.length === 0) {
              <p class="muted">No volunteers have applied yet.</p>
            }

            @if (applications.length > 0) {
              <div class="application-list">
                @for (application of applications; track application._id) {
                  <div class="application-item">
                    @if (canReviewApplications) {
                      <div class="applicant-avatar">
                        {{ (application.volunteer_id?.name || application.volunteer_id?.email || 'V').slice(0, 1).toUpperCase() }}
                      </div>
                    } @else {
                      <div class="applicant-avatar status-avatar">
                        {{ application.status.slice(0, 1).toUpperCase() }}
                      </div>
                    }

                    <div class="applicant-info">
                      <div class="applicant-head">
                        <div>
                          @if (canReviewApplications) {
                            <strong>{{ application.volunteer_id?.name || 'Volunteer' }}</strong>
                            <p>{{ application.volunteer_id?.email || 'No email available' }}</p>
                          } @else {
                            <strong>Application {{ application.status }}</strong>
                            @if (application.status === 'accepted') {
                              <p>Accepted by {{ reviewedBy(application) || postedBy }}</p>
                            } @else {
                              <p>NGO: {{ postedBy }}</p>
                            }
                          }
                        </div>
                        <span [class]="applicationStatusClass(application.status)">{{ application.status }}</span>
                      </div>

                      <div class="applicant-meta">
                        @if (canReviewApplications) {
                          <span>{{ application.volunteer_id?.location || 'Location not added' }}</span>
                        } @else if (application.reviewed_at) {
                          <span>Reviewed {{ application.reviewed_at | date: 'mediumDate' }}</span>
                        }
                        <span>Applied {{ application.createdAt | date: 'mediumDate' }}</span>
                      </div>

                      @if (canReviewApplications && application.volunteer_id?.skills?.length) {
                        <div class="mini-skill-list">
                          @for (skill of application.volunteer_id?.skills; track skill) {
                            <span>{{ skill }}</span>
                          }
                        </div>
                      }

                      <!-- Display Rejection Reason if Rejected -->
                      @if (application.status === 'rejected' && application.rejection_remark) {
                        <div class="remark-box" style="margin-top: 8px; font-size: 0.85rem; color: #c62828;">
                          <strong>Rejection Reason:</strong> {{ application.rejection_remark }}
                        </div>
                      }
                    </div>

                    @if (canReviewApplications) {
                      <div class="application-actions">
                        <!-- Only show Accept button if NOT rejected -->
                        @if (application.status !== 'rejected') {
                          <button
                            class="btn-accept"
                            type="button"
                            [disabled]="isUpdatingApplication(application._id) || application.status === 'accepted'"
                            (click)="updateApplicationStatus(application, 'accepted')"
                          >
                            Accept
                          </button>
                        }

                        <!-- Only show Reject button if NOT accepted -->
                        @if (application.status !== 'accepted') {
                          <button
                            class="btn-reject"
                            type="button"
                            [disabled]="isUpdatingApplication(application._id) || application.status === 'rejected'"
                            (click)="openRejectModal(application)"
                          >
                            Reject
                          </button>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </article>
        }
      </div>

      <aside class="details-card">
        <h2>Opportunity Details</h2>

        <div class="detail-item">
          <span class="meta-icon">D</span>
          <div>
            <strong>Date</strong>
            <p>{{ opportunity.date ? (opportunity.date | date: 'yyyy-MM-dd') : (opportunity.createdAt | date: 'yyyy-MM-dd') }}</p>
          </div>
        </div>

        <div class="detail-item">
          <span class="meta-icon">T</span>
          <div>
            <strong>Duration</strong>
            <p>{{ opportunity.duration || 'Flexible' }}</p>
          </div>
        </div>

        <div class="detail-item">
          <span class="meta-icon">L</span>
          <div>
            <strong>Location</strong>
            <p>{{ opportunity.location }}</p>
          </div>
        </div>

        <div class="detail-item">
          <span class="meta-icon">P</span>
          <div>
            <strong>Posted by</strong>
            <p>{{ postedBy }}</p>
            <small>NGO ID: {{ postedId }}</small>
          </div>
        </div>

        @if (canManage) {
          <div class="action-row">
            <button class="btn-edit" [routerLink]="['/opportunities/edit', opportunity._id]">Edit</button>
            <button class="btn-delete" [disabled]="deleting" (click)="deleteOpportunity()">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        } @else if (isVolunteer) {
          @if (applied) {
            <div [class]="applicationStatusClass(volunteerApplicationStatus)">
              {{ volunteerStatusText() }}
              @if (volunteerReviewedAt) {
                <small>Reviewed {{ volunteerReviewedAt | date: 'mediumDate' }}</small>
              }
              @if (volunteerReviewedBy) {
                <small>By {{ volunteerReviewedBy }}</small>
              }
            </div>
          }
          <button class="btn-apply" [disabled]="applying || applied" (click)="applyForOpportunity()">
            @if (applied) {
              {{ volunteerApplicationStatus ? (volunteerApplicationStatus | titlecase) : 'Applied' }}
            } @else {
              {{ applying ? 'Applying...' : 'Apply Now' }}
            }
          </button>
        } @else {
          <p class="muted side-note">Only volunteers can apply for opportunities.</p>
        }
      </aside>
    </section>
  }

  <!-- REJECTION REMARK MODAL -->
  @if (showRejectModal) {
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>Reject Application</h3>
        <p>Please enter the reason for rejection (visible to the applicant):</p>
        <textarea [(ngModel)]="rejectionRemark" rows="4" placeholder="Enter rejection reason..."></textarea>

        <div class="modal-actions">
          <button class="btn-cancel" type="button" (click)="closeRejectModal()">Cancel</button>
          <button class="btn-confirm-reject" type="button" (click)="confirmReject()">Reject Application</button>
        </div>
      </div>
    </div>
  }
</div>
~~~
## frontend/src/app/opportunities/opportunity-detail/opportunity-detail.ts

~~~typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OpportunityService } from '../opportunity.service';
import { Opportunity } from '../opportunity.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

interface OpportunityApplication {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  reviewed_at?: string | null;
  rejection_remark?: string;
  reviewed_by?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  volunteer_id?: {
    _id: string;
    name?: string;
    email?: string;
    location?: string;
    skills?: string[];
  } | null;
}

@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './opportunity-detail.html',
  styleUrl: './opportunity-detail.css',
})
export class OpportunityDetail implements OnInit {
  opportunity: Opportunity | null = null;
  loading = true;
  error = '';
  deleting = false;
  applying = false;
  applied = false;
  volunteerApplicationStatus: 'pending' | 'accepted' | 'rejected' | '' = '';
  volunteerRejectionRemark = '';
  volunteerReviewedAt = '';
  volunteerReviewedBy = '';
  applications: OpportunityApplication[] = [];
  applicationsLoading = false;
  applicationsError = '';
  applicationMode: 'review' | 'admin' | '' = '';
  applicationSummary = {
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  };
  updatingApplicationIds = new Set<string>();

  // Rejection Remark Modal State
  showRejectModal = false;
  selectedAppForReject: OpportunityApplication | null = null;
  rejectionRemark = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private opportunityService: OpportunityService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {}

  get canManage() {
    const user = this.auth.getUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    const ownerId = (this.opportunity?.ngo_id as any)?._id || this.opportunity?.ngo_id;
    return user.role === 'ngo' && ownerId === user._id;
  }

  get isVolunteer() {
    return this.auth.getUser()?.role === 'volunteer';
  }

  get isAdmin() {
    return this.auth.getUser()?.role === 'admin';
  }

  get canReviewApplications() {
    const user = this.auth.getUser();
    if (!user || user.role !== 'ngo') return false;
    const ownerId = (this.opportunity?.ngo_id as any)?._id || this.opportunity?.ngo_id;
    return ownerId === user._id;
  }

  get canViewApplicationStatus() {
    return this.canReviewApplications || this.isAdmin;
  }

  get pendingCount() {
    return this.applicationSummary.pending;
  }

  get acceptedCount() {
    return this.applicationSummary.accepted;
  }

  get rejectedCount() {
    return this.applicationSummary.rejected;
  }

  get postedBy() {
    const ngo = this.opportunity?.ngo_id;
    return ngo?.name || ngo?.email || 'WasteZero partner';
  }

  get postedId() {
    const id = this.opportunity?.ngo_id?._id || this.opportunity?.ngo_id;
    return id ? String(id).slice(-6).toUpperCase() : 'N/A';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.opportunityService.getById(id).subscribe({
      next: (opp) => {
        this.opportunity = opp;
        this.loading = false;
        if (this.canViewApplicationStatus) {
          this.loadApplications(id);
        }
        if (this.isVolunteer) {
          this.opportunityService.getMyApplications().subscribe({
            next: (apps: any[]) => {
              const currentApplication = apps.find((app) => {
                const oppId = typeof app.opportunity_id === 'object' ? app.opportunity_id._id : app.opportunity_id;
                return oppId === id;
              });
              this.applied = Boolean(currentApplication);
              this.volunteerApplicationStatus = currentApplication?.status || '';
              this.volunteerRejectionRemark = currentApplication?.rejection_remark || '';
              this.volunteerReviewedAt = currentApplication?.reviewed_at || '';
              this.volunteerReviewedBy = currentApplication?.reviewed_by?.name || currentApplication?.reviewed_by?.email || '';
              this.cdr.detectChanges();
            },
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load opportunity';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadApplications(id = this.opportunity?._id || '') {
    if (!id) return;

    this.applicationsLoading = true;
    this.applicationsError = '';
    this.cdr.detectChanges();

    this.opportunityService.getApplications(id).subscribe({
      next: (response: any) => {
        this.applicationMode = response.mode || (this.canReviewApplications ? 'review' : 'admin');
        this.applications = Array.isArray(response) ? response : response.applications || [];
        this.applicationSummary = response.summary || {
          total: this.applications.length,
          pending: this.applications.filter((app) => app.status === 'pending').length,
          accepted: this.applications.filter((app) => app.status === 'accepted').length,
          rejected: this.applications.filter((app) => app.status === 'rejected').length,
        };
        this.applicationsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.applicationsError = err.error?.message || 'Failed to load applications';
        this.applicationsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateApplicationStatus(application: OpportunityApplication, status: 'accepted' | 'rejected', remark: string = '') {
    if (!this.canReviewApplications) {
      this.applicationsError = 'Only the owning NGO can update application status';
      this.toast.error(this.applicationsError);
      return;
    }

    if (status === 'accepted' && !confirm('Accept this volunteer application?')) {
      return;
    }

    this.updatingApplicationIds.add(application._id);
    this.cdr.detectChanges();

    const payload = {
      status,
      rejection_remark: remark,
    };

    this.opportunityService.updateApplicationStatus(application._id, payload).subscribe({
      next: (updated) => {
        this.applications = this.applications.map((item) =>
          item._id === application._id ? updated : item,
        );
        this.applicationSummary = {
          total: this.applications.length,
          pending: this.applications.filter((app) => app.status === 'pending').length,
          accepted: this.applications.filter((app) => app.status === 'accepted').length,
          rejected: this.applications.filter((app) => app.status === 'rejected').length,
        };
        this.updatingApplicationIds.delete(application._id);
        this.toast.success(status === 'accepted' ? 'Application accepted' : 'Application rejected');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.applicationsError = err.error?.message || 'Failed to update application';
        this.updatingApplicationIds.delete(application._id);
        this.toast.error(this.applicationsError);
        this.cdr.detectChanges();
      },
    });
  }

  openRejectModal(application: OpportunityApplication) {
    this.selectedAppForReject = application;
    this.rejectionRemark = '';
    this.showRejectModal = true;
    this.cdr.detectChanges();
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedAppForReject = null;
    this.rejectionRemark = '';
    this.cdr.detectChanges();
  }

  confirmReject() {
    if (!this.selectedAppForReject) return;
    if (!confirm('Reject this volunteer application?')) return;

    const app = this.selectedAppForReject;
    const remark = this.rejectionRemark;
    this.closeRejectModal();
    this.updateApplicationStatus(app, 'rejected', remark);
  }

  isUpdatingApplication(id: string) {
    return this.updatingApplicationIds.has(id);
  }

  deleteOpportunity() {
    if (!this.opportunity) return;
    if (!confirm('Delete this opportunity and all related applications?')) return;

    this.deleting = true;
    this.cdr.detectChanges();

    this.opportunityService.delete(this.opportunity._id).subscribe({
      next: () => this.router.navigate(['/opportunities']),
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete opportunity';
        this.deleting = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyForOpportunity() {
    if (!this.opportunity) return;

    this.applying = true;
    this.cdr.detectChanges();

    this.opportunityService.apply(this.opportunity._id).subscribe({
      next: () => {
        this.applied = true;
        this.volunteerApplicationStatus = 'pending';
        this.applying = false;
        this.toast.success('Application sent successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to apply';
        this.applying = false;
        this.toast.error(this.error);
        this.cdr.detectChanges();
      },
    });
  }

  statusClass(status: string) {
    return `status ${status}`;
  }

  applicationStatusClass(status: string) {
    return `application-status ${status}`;
  }

  volunteerStatusText() {
    if (this.volunteerApplicationStatus === 'accepted') return 'Your request has been accepted.';
    if (this.volunteerApplicationStatus === 'rejected') {
      return this.volunteerRejectionRemark
        ? `Your request was rejected. Reason: ${this.volunteerRejectionRemark}`
        : 'Your request was rejected.';
    }
    if (this.volunteerApplicationStatus === 'pending') return 'Your request is pending NGO review.';
    return '';
  }

  reviewedBy(application: OpportunityApplication) {
    const reviewer = application.reviewed_by;
    return reviewer?.name || reviewer?.email || (application.status === 'accepted' ? this.postedBy : '');
  }

  imageFor(opp: Opportunity): string {
    if (opp.image_url) return opp.image_url;

    const text = `${opp.title} ${opp.description}`.toLowerCase();
    if (text.includes('e-waste') || text.includes('electronics')) {
      return '/demo-ewaste.svg';
    }
    if (text.includes('plastic') || text.includes('cleanup') || text.includes('clean')) {
      return '/demo-cleanup.svg';
    }
    return '/demo-opportunity.svg';
  }
}
~~~
## frontend/src/app/opportunities/opportunity-list/opportunity-list.css

~~~css
.opp-page { max-width: 1180px; }

.opp-hero {
  align-items: flex-start;
  background: linear-gradient(135deg, rgba(23, 70, 43, 0.94), rgba(45, 125, 74, 0.82)), url('/recycle-hero.jpg') center / cover no-repeat;
  border-radius: 18px;
  color: #fff;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 28px;
}

.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  margin: 0 0 8px;
}

.opp-title { font-size: 2rem; line-height: 1.1; margin: 0 0 8px; }
.opp-sub { color: rgba(255, 255, 255, 0.84); font-size: 0.96rem; margin: 0; max-width: 560px; }

.btn-create {
  background: #fff;
  border: 0;
  border-radius: 10px;
  color: #17462b;
  flex-shrink: 0;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  padding: 11px 18px;
}

.summary-row { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-bottom: 18px; }

.summary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid #6a7b72;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  padding: 14px 16px;
}

.summary-card span {
  color: var(--muted);
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.summary-card strong { font-size: 1.5rem; }
.accent-green { border-left-color: var(--green); }
.accent-blue { border-left-color: #2b73b7; }

.filters {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 170px 170px;
  margin-bottom: 18px;
  padding: 12px;
}

.search-input,
.filter-select {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--ink);
  font-family: inherit;
  font-size: 0.9rem;
  min-height: 42px;
  outline: none;
  padding: 10px 12px;
}

.search-input:focus,
.filter-select:focus { border-color: var(--green); }

.grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  min-height: 390px;
  overflow: hidden;
}

.card-media { background: var(--input-muted); height: 170px; overflow: hidden; position: relative; }
.card-img { display: block; height: 100%; object-fit: cover; width: 100%; }

.badge {
  border-radius: 999px;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 5px 10px;
  position: absolute;
  right: 12px;
  text-transform: capitalize;
  top: 12px;
}

.card-body { display: flex; flex: 1; flex-direction: column; padding: 16px; }
.card-title { font-size: 1.05rem; line-height: 1.3; margin: 0 0 8px; }
.card-desc { color: var(--muted); flex: 1; font-size: 0.88rem; margin: 0 0 14px; }
.card-meta { display: grid; gap: 8px; margin-bottom: 15px; }

.card-meta span {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--muted);
  display: grid;
  font-size: 0.8rem;
  padding: 8px 10px;
}

.card-meta strong { color: var(--ink); font-size: 0.68rem; text-transform: uppercase; }
.card-actions, .manage-btns { display: flex; gap: 8px; }

.application-chip {
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 10px;
  padding: 9px 11px;
  text-align: center;
}

.application-chip.pending {
  background: #fff4df;
  border: 1px solid #f4d09a;
  color: #9a5200;
}

.application-chip.accepted {
  background: #e6f6ed;
  border: 1px solid #9ed7b8;
  color: #13733a;
}

.application-chip.rejected {
  background: #fdecea;
  border: 1px solid #f4b4ae;
  color: #b42318;
}

.btn-apply,
.btn-edit,
.btn-delete,
.btn-secondary {
  align-items: center;
  border-radius: 9px;
  display: inline-flex;
  flex: 1;
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 800;
  justify-content: center;
  min-height: 38px;
  padding: 9px 10px;
  text-decoration: none;
}

.btn-apply {
  background: linear-gradient(135deg, #3da35b, #175d35);
  border: 1px solid #175d35;
  color: #fff;
}
.btn-secondary, .btn-edit { background: var(--surface); border: 1px solid var(--border); color: var(--ink); }
.btn-delete { background: #fdecea; border: 1px solid #f5c6c2; color: var(--danger); }
.btn-apply:disabled { cursor: not-allowed; opacity: 0.6; }

.search-hint {
  align-items: center;
  color: var(--muted);
  display: flex;
  font-size: 0.84rem;
  gap: 10px;
  margin: -4px 0 16px;
}

.search-hint strong { color: var(--ink); }
.clear-btn { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); cursor: pointer; font: inherit; padding: 4px 10px; }
.state-center, .state-msg { color: var(--muted); margin: 48px 0; text-align: center; }
.state-msg.error { color: var(--danger); }
.empty { background: var(--surface); border: 1px dashed var(--border); border-radius: 14px; color: var(--muted); padding: 58px 20px; text-align: center; }

@media (max-width: 560px) {
  .opp-hero { flex-direction: column; padding: 22px; }
  .btn-create { width: 100%; }
  .summary-row, .filters, .grid { grid-template-columns: 1fr; }
}
~~~
## frontend/src/app/opportunities/opportunity-list/opportunity-list.html

~~~html
<div class="opp-page">

  <section class="opp-hero">
    <div>
      <p class="eyebrow">Community workboard</p>
      <h1 class="opp-title">Volunteer Opportunities</h1>
      <p class="opp-sub">Find active recycling drives, cleanup events, and local waste management initiatives.</p>
    </div>
    @if (canCreate) {
      <button class="btn-create" [routerLink]="['/opportunities/create']">
        Create Opportunity
      </button>
    }
  </section>

  <section class="summary-row">
    <div class="summary-card">
      <span>Total</span>
      <strong>{{ totalCount }}</strong>
    </div>
    <div class="summary-card accent-green">
      <span>Open</span>
      <strong>{{ openCount }}</strong>
    </div>
    <div class="summary-card accent-blue">
      <span>Cities</span>
      <strong>{{ cityCount }}</strong>
    </div>
  </section>

  <section class="filters">
    <input
      class="search-input"
      placeholder="Search by title, skills, location..."
      [(ngModel)]="search"
      (input)="onSearch()"
    />

    <select class="filter-select" [(ngModel)]="statusFilter" (change)="onFilterChange()">
      <option value="all">All Statuses</option>
      <option value="open">Open</option>
      <option value="closed">Closed</option>
      <option value="in-progress">In Progress</option>
    </select>

    <select class="filter-select" [(ngModel)]="cityFilter" (change)="onCityChange()">
      <option value="all">All Cities</option>
      @for (city of cities; track city) {
        <option [value]="city">{{ city }}</option>
      }
    </select>
  </section>

  @if (search) {
    <p class="search-hint">
      Showing results for <strong>"{{ search }}"</strong>
      - searched in title, description, location and skills
      <button class="clear-btn" (click)="search = ''; onSearch()">Clear</button>
    </p>
  }

  @if (loading) {
    <div class="state-center">
      <p class="state-msg">Loading opportunities...</p>
    </div>
  }

  @if (!loading && error) {
    <div class="state-center">
      <p class="state-msg error">{{ error }}</p>
    </div>
  }

  @if (!loading && !error && opportunities.length === 0) {
    <div class="empty">
      <p>No opportunities found matching your criteria.</p>
      <small>Try a different search term or clear the filters.</small>
    </div>
  }

  @if (!loading && !error && opportunities.length > 0) {
    <div class="grid">
      @for (opp of opportunities; track opp._id) {
        <article class="card">

          <div class="card-media">
            <img [src]="imageFor(opp)" [alt]="opp.title" class="card-img" />
            <span class="badge" [style.background]="statusColor(opp.status)">
              {{ opp.status }}
            </span>
          </div>

          <div class="card-body">
            <h2 class="card-title">{{ opp.title }}</h2>

            <p class="card-desc">{{ excerpt(opp.description) }}</p>

            <div class="card-meta">
              @if (opp.location) {
                <span><strong>Location</strong>{{ opp.location }}</span>
              }
              @if (opp.duration) {
                <span><strong>Duration</strong>{{ opp.duration }}</span>
              }
              @if (opp.required_skills.length) {
                <span><strong>Skills</strong>{{ opp.required_skills.join(', ') }}</span>
              }
              <span><strong>Posted by</strong>{{ ngoLabel(opp) }}</span>
            </div>

            @if (isVolunteer) {
              @if (appliedIds.has(opp._id)) {
                <div [class]="applicationStatusClass(opp._id)">
                  Request {{ applicationStatusLabel(opp._id) }}
                </div>
              }
              <div class="card-actions">
                <a class="btn-secondary" [routerLink]="['/opportunities', opp._id]">View Details</a>
                <button
                  class="btn-apply"
                  [disabled]="applyingId === opp._id || appliedIds.has(opp._id)"
                  (click)="applyForOpportunity(opp._id)"
                >
                  @if (appliedIds.has(opp._id)) { {{ applicationStatusLabel(opp._id) }} }
                  @else if (applyingId === opp._id) { Applying... }
                  @else { Apply Now }
                </button>
              </div>
            }

            @if (canManageOpp(opp)) {
              <div class="manage-btns">
                <a class="btn-secondary" [routerLink]="['/opportunities', opp._id]">Details</a>
                <button class="btn-edit" [routerLink]="['/opportunities/edit', opp._id]">
                  Edit
                </button>
                <button class="btn-delete" (click)="deleteOpportunity(opp._id)">
                  Delete
                </button>
              </div>
            }

            @if (!isVolunteer && !canManageOpp(opp)) {
              <div class="card-actions">
                <a class="btn-secondary" [routerLink]="['/opportunities', opp._id]">View Details</a>
              </div>
            }

          </div>
        </article>
      }
    </div>
  }

</div>
~~~
## frontend/src/app/opportunities/opportunity-list/opportunity-list.ts

~~~typescript
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { OpportunityService } from '../opportunity.service';
import { Opportunity } from '../opportunity.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './opportunity-list.html',
  styleUrl: './opportunity-list.css',
})
export class OpportunityList implements OnInit, OnDestroy {
  opportunities: Opportunity[] = [];
  loading = true;
  error = '';
  search = '';
  statusFilter = 'all';
  cityFilter = 'all';
  cities: string[] = [];
  applyingId = '';
  appliedIds: Set<string> = new Set();
  applicationStatuses = new Map<string, 'pending' | 'accepted' | 'rejected'>();

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private opportunityService: OpportunityService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {}

get userRole() { return this.auth.getUser()?.role; }
  get canCreate() { return this.userRole === 'admin' || this.userRole === 'ngo'; }
  get isVolunteer() { return this.userRole === 'volunteer'; }
  get totalCount() { return this.opportunities.length; }

  canManageOpp(opp: Opportunity): boolean {
    const user = this.auth.getUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    const ownerId = (opp.ngo_id as any)?._id || opp.ngo_id;
    return user.role === 'ngo' && ownerId === user._id;
  }
  get openCount() { return this.opportunities.filter(opp => opp.status === 'open').length; }
  get cityCount() { return this.cities.length; }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.search = params['search'];
      }
      this.loadOpportunities();
    });

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadOpportunities();
      });

    if (this.auth.getUser()?.role === 'volunteer') {
      this.loadMyApplications();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOpportunities() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.opportunityService.getAll({
      status: this.statusFilter,
      search: this.search,
      city: this.cityFilter,
    }).subscribe({
      next: (data) => {
        this.opportunities = data;

        const allCities = data
          .map(o => o.location?.trim())
          .filter(Boolean) as string[];
        this.cities = [...new Set(allCities)].sort();

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.name === 'TimeoutError'
          ? 'Request timed out. Please check if the backend is running.'
          : err.error?.message || 'Failed to load opportunities';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadMyApplications() {
    this.opportunityService.getMyApplications().subscribe({
      next: (applications: any[]) => {
        this.appliedIds.clear();
        this.applicationStatuses.clear();
        applications.forEach(app => {
          const opportunityId = typeof app.opportunity_id === 'object'
            ? app.opportunity_id._id
            : app.opportunity_id;
          this.appliedIds.add(opportunityId);
          this.applicationStatuses.set(opportunityId, app.status || 'pending');
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load applications', err),
    });
  }

  onSearch() { this.searchSubject.next(this.search); }
  onFilterChange() { this.loadOpportunities(); }
  onCityChange() { this.loadOpportunities(); }

  clearSearch() {
    this.search = '';
    this.router.navigate(['/opportunities']);
  }

  deleteOpportunity(id: string) {
    if (!confirm('Are you sure? This will permanently delete the opportunity and all applications.')) return;
    this.opportunityService.delete(id).subscribe({
      next: () => {
        this.opportunities = this.opportunities.filter(o => o._id !== id);
        this.cdr.detectChanges();
      },
      error: () => alert('Failed to delete opportunity'),
    });
  }

  applyForOpportunity(id: string) {
    this.applyingId = id;
    this.cdr.detectChanges();
    this.opportunityService.apply(id).subscribe({
      next: () => {
        this.appliedIds.add(id);
        this.applicationStatuses.set(id, 'pending');
        this.applyingId = '';
        this.toast.success('Application sent successfully');
        this.loadMyApplications();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to apply');
        this.applyingId = '';
        this.cdr.detectChanges();
      },
    });
  }

  statusColor(status: string): string {
    return status === 'open' ? '#2e7d32' : status === 'closed' ? '#c62828' : '#e65100';
  }

  applicationStatus(oppId: string) {
    return this.applicationStatuses.get(oppId);
  }

  applicationStatusLabel(oppId: string) {
    const status = this.applicationStatus(oppId);
    if (status === 'accepted') return 'Accepted';
    if (status === 'rejected') return 'Rejected';
    if (status === 'pending') return 'Pending';
    return '';
  }

  applicationStatusClass(oppId: string) {
    return `application-chip ${this.applicationStatus(oppId) || ''}`;
  }

  excerpt(text: string): string {
    if (!text) return '';
    return text.length > 110 ? `${text.slice(0, 110)}...` : text;
  }

  ngoLabel(opp: Opportunity): string {
  const ngo = opp.ngo_id;

  if (!ngo) return 'Unknown NGO';

  // If ngo_id is populated (object)
  if (typeof ngo === 'object' && ngo._id) {
    return ngo._id.slice(-6);
  }

  // If ngo_id is just a string
  return String(ngo).slice(-6);
}

  imageFor(opp: Opportunity): string {
    if (opp.image_url) return opp.image_url;
    const text = `${opp.title} ${opp.description}`.toLowerCase();
    if (text.includes('e-waste') || text.includes('electronics')) return '/demo-ewaste.svg';
    if (text.includes('plastic') || text.includes('cleanup') || text.includes('clean')) return '/demo-cleanup.svg';
    return '/demo-opportunity.svg';
  }
}
~~~
## frontend/src/app/opportunities/opportunity.model.ts

~~~typescript
export interface Opportunity {
  _id: string;
  ngo_id: any;
  title: string;
  description: string;
  required_skills: string[];
  waste_types?: string[];
  duration: string;
  location: string;
  status: 'open' | 'closed' | 'in-progress';
  image_url?: string;
  date?: string;
  createdAt?: string;
}
~~~
## frontend/src/app/opportunities/opportunity.service.ts

~~~typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Opportunity } from './opportunity.model';

@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private api = 'http://localhost:5000/api/opportunities';

  constructor(private http: HttpClient) {}

  getAll(filters?: { status?: string; search?: string; city?: string }): Observable<Opportunity[]> {
    let params = new HttpParams();
    if (filters?.status && filters.status !== 'all') params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.city && filters.city !== 'all') params = params.set('city', filters.city);
    return this.http.get<Opportunity[]>(this.api, { params });
  }

  getById(id: string): Observable<Opportunity> {
    return this.http.get<Opportunity>(`${this.api}/${id}`);
  }

  create(data: any): Observable<Opportunity> {
    return this.http.post<Opportunity>(this.api, data);
  }

  update(id: string, data: any): Observable<Opportunity> {
    return this.http.put<Opportunity>(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  apply(id: string): Observable<any> {
    return this.http.post(`${this.api}/${id}/apply`, {});
  }

  getApplications(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}/applications`);
  }

  updateApplicationStatus(
    applicationId: string,
    statusOrPayload: 'accepted' | 'rejected' | { status: 'accepted' | 'rejected'; rejection_remark?: string; remark?: string }
  ): Observable<any> {
    const payload = typeof statusOrPayload === 'string'
      ? { status: statusOrPayload }
      : statusOrPayload;

    return this.http.put(`${this.api}/applications/${applicationId}/status`, payload);
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/my-applications`);
  }

  getDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.api}/dashboard`);
  }
}
~~~
## frontend/src/app/pickups/pickups.css

~~~css
.page-head { margin-bottom: 22px; }
.eyebrow { color: #218a4a; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }
h1 { margin: 4px 0; font-size: 32px; }
.page-head p:last-child, .section-head span { color: #66766c; }
.alert { margin-bottom: 15px; padding: 12px 14px; border-radius: 10px; background: #fee4e2; color: #b42318; }
.schedule-card, .history { padding: 22px; border: 1px solid #dce7df; border-radius: 18px; background: var(--surface, white); }
.schedule-card { margin-bottom: 22px; }
.form-head, .section-head { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 18px; }
.form-head h2, .section-head h2 { margin: 0; font-size: 20px; }
.form-head span { color: #738078; font-size: 13px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-grid label, .filter { display: grid; gap: 7px; font-weight: 700; font-size: 14px; }
.form-grid .wide { grid-column: 1 / -1; }
input, select, textarea { width: 100%; box-sizing: border-box; border: 1px solid #cbdad0; border-radius: 10px; padding: 11px 12px; background: var(--surface, white); color: inherit; font: inherit; }
textarea { resize: vertical; }
.primary { margin-top: 17px; border: 0; border-radius: 10px; padding: 12px 20px; background: #238b4b; color: white; font-weight: 800; }
.primary:disabled { opacity: .55; }
.filter { grid-template-columns: auto 150px; align-items: center; }
.pickup-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(265px, 1fr)); gap: 14px; }
article { padding: 17px; border: 1px solid #dce7df; border-radius: 14px; background: #fbfdfb; }
.card-top { display: flex; justify-content: space-between; gap: 10px; }
.waste, .status { text-transform: capitalize; font-size: 12px; font-weight: 800; border-radius: 20px; padding: 5px 8px; }
.waste { background: #e8f5eb; color: #1d7540; }
.status { background: #eef1ef; color: #54635a; }
.status[data-status="confirmed"] { background: #e3f2fd; color: #1f628f; }
.status[data-status="in-progress"] { background: #fff3d9; color: #8a5d00; }
.status[data-status="completed"] { background: #dff5e6; color: #176b39; }
.status[data-status="cancelled"] { background: #fee4e2; color: #b42318; }
article h3 { margin: 15px 0 4px; font-size: 18px; }
.slot { margin: 0 0 12px; text-transform: capitalize; color: #66766c; }
.address, .notes { margin: 8px 0; }
.notes { padding: 9px; border-radius: 8px; background: #f0f5f1; color: #5d6b62; }
.requester { display: grid; padding-top: 11px; border-top: 1px solid #dce7df; }
.requester span, .assigned { color: #66766c; font-size: 13px; }
.manage { display: flex; gap: 8px; margin-top: 14px; }
.secondary { border: 1px solid #238b4b; border-radius: 9px; padding: 9px 12px; background: white; color: #1d7540; font-weight: 800; }
.danger { width: 100%; margin-top: 14px; border-color: #e6aaa5; color: #b42318; }
.empty { padding: 30px; text-align: center; color: #66766c; }
@media (max-width: 700px) { .form-grid { grid-template-columns: 1fr; } .form-grid .wide { grid-column: auto; } .form-head, .section-head { align-items: flex-start; flex-direction: column; } }
~~~
## frontend/src/app/pickups/pickups.html

~~~html
<section class="page">
  <header class="page-head">
    <div>
      <p class="eyebrow">Collection service</p>
      <h1>{{ isVolunteer ? 'Schedule a pickup' : 'Pickup management' }}</h1>
      <p>{{ isVolunteer ? 'Choose what, when, and where our collection partner should pick up.' : 'Review requests and keep residents updated.' }}</p>
    </div>
  </header>

  @if (error) { <div class="alert">{{ error }}</div> }

  @if (isVolunteer) {
    <form class="schedule-card" [formGroup]="form" (ngSubmit)="schedule()">
      <div class="form-head">
        <h2>New pickup request</h2>
        <span>All fields marked * are required</span>
      </div>

      <div class="form-grid">
        <label>
          <span>Waste type *</span>
          <select formControlName="waste_type">
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="organic">Organic</option>
            <option value="e-waste">E-waste</option>
            <option value="glass">Glass</option>
            <option value="metal">Metal</option>
            <option value="mixed">Mixed</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          <span>Estimated quantity (kg) *</span>
          <input type="number" min="0.1" max="10000" step="0.1" formControlName="quantity_kg" />
        </label>

        <label>
          <span>Pickup date *</span>
          <input type="date" [min]="today" formControlName="pickup_date" />
        </label>

        <label>
          <span>Preferred time *</span>
          <select formControlName="time_slot">
            <option value="morning">Morning · 8 AM–12 PM</option>
            <option value="afternoon">Afternoon · 12–4 PM</option>
            <option value="evening">Evening · 4–8 PM</option>
          </select>
        </label>

        <label class="wide">
          <span>Collection address *</span>
          <textarea rows="2" formControlName="address" placeholder="House/building, street, area and city"></textarea>
        </label>

        <label class="wide">
          <span>Notes for the collector</span>
          <textarea rows="2" formControlName="notes" placeholder="Access instructions, item details, or special handling"></textarea>
        </label>
      </div>

      <button class="primary" type="submit" [disabled]="saving">
        {{ saving ? 'Scheduling...' : 'Schedule pickup' }}
      </button>
    </form>
  }

  <section class="history">
    <div class="section-head">
      <div>
        <h2>{{ isVolunteer ? 'My pickup requests' : 'Pickup queue' }}</h2>
        <span>{{ pickups.length }} request{{ pickups.length === 1 ? '' : 's' }}</span>
      </div>
      <label class="filter">
        <span>Status</span>
        <select [value]="statusFilter" (change)="load($any($event.target).value)">
          <option value="all">All</option>
          @for (status of statuses; track status) {
            <option [value]="status">{{ status }}</option>
          }
        </select>
      </label>
    </div>

    @if (loading) {
      <div class="empty">Loading pickup requests...</div>
    } @else if (!pickups.length) {
      <div class="empty">No pickup requests match this filter.</div>
    }

    <div class="pickup-grid">
      @for (pickup of pickups; track pickup._id) {
        <article>
          <div class="card-top">
            <span class="waste">{{ pickup.waste_type }}</span>
            <span class="status" [attr.data-status]="pickup.status">{{ pickup.status }}</span>
          </div>
          <h3>{{ pickup.quantity_kg }} kg · {{ pickup.pickup_date | date:'mediumDate' }}</h3>
          <p class="slot">{{ pickup.time_slot }} pickup</p>
          <p class="address">{{ pickup.address }}</p>
          @if (pickup.notes) { <p class="notes">{{ pickup.notes }}</p> }
          @if (!isVolunteer) {
            <div class="requester">
              <strong>{{ pickup.user_id?.name }}</strong>
              <span>{{ pickup.user_id?.email }}</span>
            </div>
          }
          @if (pickup.assigned_to) {
            <p class="assigned">Coordinator: {{ pickup.assigned_to.name }}</p>
          }

          @if (canCancel(pickup)) {
            <button class="secondary danger" type="button" (click)="cancel(pickup)">Cancel pickup</button>
          } @else if (!isVolunteer && pickup.status !== 'completed' && pickup.status !== 'cancelled') {
            <div class="manage">
              <select #nextStatus [value]="pickup.status">
                @for (status of statuses; track status) {
                  <option [value]="status">{{ status }}</option>
                }
              </select>
              <button class="secondary" type="button" (click)="updateStatus(pickup, nextStatus.value)">Update</button>
            </div>
          }
        </article>
      }
    </div>
  </section>
</section>
~~~
## frontend/src/app/pickups/pickups.ts

~~~typescript
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Pickup, PickupService } from '../services/pickup.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-pickups',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pickups.html',
  styleUrl: './pickups.css',
})
export class Pickups implements OnInit {
  user: any;
  form: FormGroup;
  pickups: Pickup[] = [];
  loading = true;
  saving = false;
  error = '';
  statusFilter = 'all';
  readonly today = new Date().toISOString().slice(0, 10);
  readonly statuses: Pickup['status'][] = [
    'scheduled',
    'confirmed',
    'in-progress',
    'completed',
    'cancelled',
  ];

  constructor(
    private fb: FormBuilder,
    private pickupService: PickupService,
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.auth.getUser();
    this.form = this.fb.group({
      waste_type: ['plastic', Validators.required],
      quantity_kg: [1, [Validators.required, Validators.min(0.1), Validators.max(10000)]],
      pickup_date: ['', Validators.required],
      time_slot: ['morning', Validators.required],
      address: [this.user?.address || this.user?.location || '', [Validators.required, Validators.maxLength(300)]],
      notes: ['', Validators.maxLength(500)],
    });
  }

  get isVolunteer() {
    return this.user?.role === 'volunteer';
  }

  ngOnInit() {
    this.load();
  }

  load(status = this.statusFilter) {
    this.statusFilter = status;
    this.loading = true;
    this.error = '';
    this.pickupService.getAll(status).subscribe({
      next: (pickups) => {
        this.pickups = pickups;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load pickups';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  schedule() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    this.pickupService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('Pickup scheduled successfully');
        this.form.reset({
          waste_type: 'plastic',
          quantity_kg: 1,
          pickup_date: '',
          time_slot: 'morning',
          address: this.user?.address || this.user?.location || '',
          notes: '',
        });
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err.error?.message || 'Pickup could not be scheduled';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancel(pickup: Pickup) {
    if (!confirm('Cancel this pickup request?')) return;
    this.pickupService.cancel(pickup._id).subscribe({
      next: () => {
        this.toast.success('Pickup cancelled');
        this.load();
      },
      error: (err) => this.toast.error(err.error?.message || 'Pickup could not be cancelled'),
    });
  }

  updateStatus(pickup: Pickup, status: string) {
    this.pickupService.updateStatus(pickup._id, status as Pickup['status']).subscribe({
      next: () => {
        this.toast.success(`Pickup marked ${status}`);
        this.load();
      },
      error: (err) => this.toast.error(err.error?.message || 'Status could not be updated'),
    });
  }

  canCancel(pickup: Pickup) {
    return this.isVolunteer && ['scheduled', 'confirmed'].includes(pickup.status);
  }
}
~~~
## frontend/src/app/profile/profile.css

~~~css
.profile-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 8px 0 24px;
  box-sizing: border-box;
}

.loading {
  text-align: center;
  color: var(--muted);
  margin-top: 60px;
}

.profile-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  padding: 28px;
  box-sizing: border-box;
}

.profile-header {
  background: linear-gradient(135deg, var(--green-light), transparent);
  border: 1px solid var(--border);
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  margin-bottom: 18px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
  flex-shrink: 0;
}

.who h2 {
  margin: 0 0 4px;
  font-size: 1.1rem;
  color: var(--ink);
}

.email-text {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
}

.role-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--green-light);
  color: var(--green-dark);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: capitalize;
}

.tabs {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  padding: 4px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 10px 18px;
  border: none;
  border-radius: 9px;
  background: transparent;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}

.tab-btn.active {
  color: var(--green-dark);
  background: var(--surface);
  font-weight: 700;
}

.tab-btn:hover:not(.active) {
  color: var(--ink);
}

.section-title {
  font-size: 1.08rem;
  font-weight: 700;
  margin: 0 0 3px;
  color: var(--ink);
}

.section-sub {
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0 0 16px;
}

.field {
  margin-bottom: 14px;
}

.field label {
  display: block;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 5px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.field input,
.field textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 9px;
  font-size: 0.92rem;
  font-family: inherit;
  background: var(--input-bg);
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
  background: var(--surface);
}

.field input[readonly] {
  background: var(--input-muted);
  color: var(--muted);
  cursor: not-allowed;
}

.field textarea {
  resize: vertical;
  min-height: 72px;
}

.field small {
  display: block;
  margin-top: 4px;
  font-size: 0.74rem;
  color: var(--muted);
}

.input-eye {
  position: relative;
  display: flex;
  align-items: center;
}

.input-eye input {
  width: 100%;
  padding-right: 44px;
}

.eye-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
  color: var(--muted);
  display: flex;
  align-items: center;
}

.eye-btn:hover {
  color: var(--ink);
}

.alert {
  padding: 9px 12px;
  border-radius: 9px;
  font-size: 0.84rem;
  margin-bottom: 14px;
}

.alert.success {
  background: var(--green-light);
  color: var(--green-dark);
  border: 1px solid #c8e6c9;
}

.alert.error {
  background: #fdecea;
  color: var(--danger);
  border: 1px solid #f5c6c2;
}

.otp-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--green-light);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 18px;
}

.otp-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.otp-info p {
  margin: 0;
  font-size: 0.86rem;
  color: var(--ink);
  line-height: 1.5;
}

.btn-primary {
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #3da35b 0%, #175d35 100%);
  color: #fff;
  font-size: 0.93rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s, transform 0.1s;
  box-shadow: 0 3px 10px rgba(46, 125, 50, 0.22);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.91;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  flex: 1;
  padding: 11px;
  border: 1.5px solid var(--green);
  border-radius: 9px;
  background: #fff;
  color: var(--green-dark);
  font-size: 0.93rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-outline:hover {
  background: var(--green-light);
}

.btn-row {
  display: flex;
  gap: 10px;
}

.btn-row .btn-primary {
  flex: 2;
}
~~~
## frontend/src/app/profile/profile.html

~~~html
<div class="profile-page" style="width:100%">
  @if (loading) {
    <p class="loading">Loading...</p>
  } @else {
    <div class="profile-card">

      <div class="profile-header">
        <div class="avatar">{{ initial }}</div>
        <div class="who">
          <h2>{{ user?.name }}</h2>
          <span class="role-badge">{{ user?.role }}</span>
          <p class="email-text">{{ user?.email }}</p>
        </div>
      </div>

      <div class="tabs">
        <button class="tab-btn" [class.active]="activeTab === 'profile'" (click)="setTab('profile')">
          Profile
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'password'" (click)="setTab('password')">
          Password
        </button>
      </div>

      @if (activeTab === 'profile') {
        <div class="tab-content">
          <h3 class="section-title">Personal Information</h3>
          <p class="section-sub">Update your personal information and profile details</p>

          @if (profileMessage) {
            <div class="alert success">{{ profileMessage }}</div>
          }
          @if (profileError) {
            <div class="alert error">{{ profileError }}</div>
          }

          <form [formGroup]="profileForm" (ngSubmit)="onSave()">
            <div class="field">
              <label>Full Name</label>
              <input formControlName="name" placeholder="Your full name" />
            </div>

            <div class="field">
              <label>Email</label>
              <input formControlName="email" readonly />
              <small>This email is used for account notifications.</small>
            </div>

            <div class="field">
              <label>Location</label>
              <input formControlName="location" placeholder="Your city or area" />
              <small>This helps match you with nearby opportunities.</small>
            </div>

            <div class="field">
              <label>Skills</label>
              <input formControlName="skills" placeholder="e.g. teamwork, recycling, driving" />
              <small>Separate skills with commas.</small>
            </div>

            @if (user?.role === 'volunteer') {
              <div class="field">
                <label>Preferred Waste Types</label>
                <input formControlName="waste_types" placeholder="e.g. plastic, organic, e-waste" />
                <small>These preferences improve your opportunity matches.</small>
              </div>
            }

            <div class="field">
              <label>Bio</label>
              <textarea formControlName="bio" rows="3" placeholder="Tell us about yourself..."></textarea>
            </div>

            <button class="btn-primary" type="submit" [disabled]="saving || profileForm.invalid">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>
      }

      @if (activeTab === 'password') {
        <div class="tab-content">
          <h3 class="section-title">Change Password</h3>
          <p class="section-sub">Update your password to secure your account</p>

          @if (passwordMessage) {
            <div class="alert success">{{ passwordMessage }}</div>
          }

          @if (!otpSent) {
            @if (otpError) {
              <div class="alert error">{{ otpError }}</div>
            }

            <div class="otp-info">
              <span class="otp-icon">OTP</span>
              <p>
                We will send a 6-digit OTP to <strong>{{ user?.email }}</strong>
                to verify it's you before changing your password.
              </p>
            </div>

            <button class="btn-primary" (click)="requestOtp()" [disabled]="sendingOtp">
              {{ sendingOtp ? 'Sending OTP...' : 'Send OTP to My Email' }}
            </button>
          }

          @if (otpSent) {
            @if (otpMessage) {
              <div class="alert success">{{ otpMessage }}</div>
            }
            @if (passwordError) {
              <div class="alert error">{{ passwordError }}</div>
            }

            <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
              <div class="field">
                <label>Enter OTP</label>
                <input
                  formControlName="otp"
                  placeholder="6-digit OTP from your email"
                  maxlength="6"
                  inputmode="numeric"
                />
                <small>Check your email inbox. Valid for 10 minutes.</small>
              </div>

              <div class="field">
                <label>Current Password</label>
                <div class="input-eye">
                  <input
                    formControlName="currentPassword"
                    [type]="showCurrentPassword ? 'text' : 'password'"
                    placeholder="Enter your current password"
                  />
                  <button type="button" class="eye-btn" (click)="toggleCurrentPassword()">
                    {{ showCurrentPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div class="field">
                <label>New Password</label>
                <div class="input-eye">
                  <input
                    formControlName="newPassword"
                    [type]="showNewPassword ? 'text' : 'password'"
                    placeholder="At least 6 characters and 1 number"
                  />
                  <button type="button" class="eye-btn" (click)="toggleNewPassword()">
                    {{ showNewPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <small>Use at least 6 characters and include one number.</small>
              </div>

              <div class="field">
                <label>Confirm New Password</label>
                <div class="input-eye">
                  <input
                    formControlName="confirmPassword"
                    [type]="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Repeat new password"
                  />
                  <button type="button" class="eye-btn" (click)="toggleConfirmPassword()">
                    {{ showConfirmPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div class="btn-row">
                <button type="button" class="btn-outline" (click)="resendOtp()">
                  Resend OTP
                </button>
                <button
                  type="submit"
                  class="btn-primary"
                  [disabled]="changingPassword || passwordForm.invalid"
                >
                  {{ changingPassword ? 'Changing...' : 'Change Password' }}
                </button>
              </div>
            </form>
          }

        </div>
      }

    </div>
  }
</div>
~~~
## frontend/src/app/profile/profile.ts

~~~typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OtpService } from '../services/otp.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  activeTab: 'profile' | 'password' = 'profile';
  profileForm: FormGroup;
  user: any = null;
  loading = true;
  saving = false;
  profileMessage = '';
  profileError = '';
  sendingOtp = false;
  otpSent = false;
  otpMessage = '';
  otpError = '';
  passwordForm: FormGroup;
  changingPassword = false;
  passwordMessage = '';
  passwordError = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private otpService: OtpService,
    private cdr: ChangeDetectorRef,
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      location: [''],
      skills: [''],
      waste_types: [''],
      bio: [''],
    });

    this.passwordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]],
      confirmPassword: ['', Validators.required],
    });

    const cached = this.auth.getUser();
    if (cached) {
      this.user = cached;
      this.profileForm.patchValue({
        name: cached.name,
        email: cached.email,
        location: cached.location || '',
        skills: (cached.skills || []).join(', '),
        waste_types: (cached.waste_types || []).join(', '),
        bio: cached.bio || '',
      });
      this.loading = false;
    }
  }

  get initial() {
    return (this.user?.name || '?').charAt(0).toUpperCase();
  }

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          location: user.location || '',
          skills: (user.skills || []).join(', '),
          waste_types: (user.waste_types || []).join(', '),
          bio: user.bio || '',
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        if (!this.user) {
          this.profileError = 'Failed to load profile. Please refresh.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  setTab(tab: 'profile' | 'password') {
    this.activeTab = tab;
    this.profileMessage = '';
    this.profileError = '';
    this.otpSent = false;
    this.otpMessage = '';
    this.otpError = '';
    this.passwordMessage = '';
    this.passwordError = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.passwordForm.reset();
    this.cdr.detectChanges();
  }

  onSave() {
    if (this.profileForm.invalid) return;
    this.saving = true;
    this.profileMessage = '';
    this.profileError = '';

    const { email, ...rest } = this.profileForm.value;
    const data = { ...rest };
    data.skills = data.skills
      ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
    data.waste_types = data.waste_types
      ? data.waste_types.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    this.auth.updateProfile(data).subscribe({
      next: (res) => {
        this.auth.saveAuth(res);
        this.user = res;
        this.profileMessage = 'Profile updated successfully!';
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.profileError = err.error?.message || 'Update failed.';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  requestOtp() {
    this.sendingOtp = true;
    this.otpMessage = '';
    this.otpError = '';
    this.cdr.detectChanges();

    this.otpService.sendOtp().subscribe({
      next: (res: any) => {
        this.otpSent = true;
        this.otpMessage = res?.message || 'OTP sent to your email!';
        this.sendingOtp = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.otpError = err?.error?.message || 'Failed to send OTP.';
        this.sendingOtp = false;
        this.cdr.detectChanges();
      },
    });
  }

  onChangePassword() {
    if (this.passwordForm.invalid) return;
    const { otp, currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError = 'Passwords do not match';
      this.cdr.detectChanges();
      return;
    }

    if (!/\d/.test(newPassword)) {
      this.passwordError = 'New password must contain at least one number';
      this.cdr.detectChanges();
      return;
    }

    this.changingPassword = true;
    this.passwordMessage = '';
    this.passwordError = '';

    this.otpService.verifyAndChange({ otp, currentPassword, newPassword, confirmPassword }).subscribe({
      next: (res) => {
        this.passwordMessage = res.message;
        this.changingPassword = false;
        this.otpSent = false;
        this.passwordForm.reset();
        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.passwordError = err.error?.message || 'Failed to change password.';
        this.changingPassword = false;
        this.cdr.detectChanges();
      },
    });
  }

  resendOtp() {
    this.otpSent = false;
    this.passwordForm.reset();
    this.passwordError = '';
    this.passwordMessage = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.cdr.detectChanges();
  }

  toggleCurrentPassword() { this.showCurrentPassword = !this.showCurrentPassword; }
  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }
}
~~~
## frontend/src/app/services/auth.service.ts

~~~typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  getProfile(): Observable<any> {
  return this.http.get(`${this.api}/users/profile`, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.api}/users/profile`, data);
  }

  saveAuth(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
~~~
## frontend/src/app/services/matching.service.ts

~~~typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OpportunityMatch {
  opportunity: any;
  score: number;
  reasons: string[];
}

@Injectable({ providedIn: 'root' })
export class MatchingService {
  private api = 'http://localhost:5000/api/matches';

  constructor(private http: HttpClient) {}

  getSuggestions(): Observable<OpportunityMatch[]> {
    return this.http.get<OpportunityMatch[]>(this.api);
  }
}
~~~
## frontend/src/app/services/message.service.ts

~~~typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = 'http://localhost:5000/api/messages';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/contacts`);
  }

  getConversation(userId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${userId}`);
  }

  send(userId: string, content: string): Observable<any> {
    return this.http.post<any>(`${this.api}/${userId}`, { content });
  }
}
~~~
## frontend/src/app/services/notification.service.ts

~~~typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ notifications: any[]; unread: number }> {
    return this.http.get<{ notifications: any[]; unread: number }>(this.api);
  }

  markRead(id: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/read`, {});
  }

  markAllRead(): Observable<any> {
    return this.http.patch(`${this.api}/read-all`, {});
  }
}
~~~
## frontend/src/app/services/otp.service.ts

~~~typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OtpService {
  private api = 'http://localhost:5000/api/otp';

  constructor(private http: HttpClient) {}

  sendOtp(): Observable<any> {
  return this.http.post(`${this.api}/send`, {}, {
    headers: { 'Cache-Control': 'no-cache' }
  });
}

verifyAndChange(data: {
  otp: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Observable<any> {
  return this.http.post(`${this.api}/verify-and-change`, data);
}

sendForgotPasswordOtp(email: string): Observable<any> {
  return this.http.post(`${this.api}/forgot-password/send`, { email });
}

sendRegisterOtp(email: string): Observable<any> {
  return this.http.post(`${this.api}/register/send`, { email });
}

resetForgotPassword(data: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}): Observable<any> {
  return this.http.post(`${this.api}/forgot-password/reset`, data);
}
}
~~~
## frontend/src/app/services/pickup.service.ts

~~~typescript
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Pickup {
  _id: string;
  user_id: any;
  assigned_to?: any;
  waste_type: string;
  quantity_kg: number;
  pickup_date: string;
  time_slot: string;
  address: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class PickupService {
  private api = 'http://localhost:5000/api/pickups';

  constructor(private http: HttpClient) {}

  getAll(status = 'all'): Observable<Pickup[]> {
    const params = status === 'all' ? undefined : new HttpParams().set('status', status);
    return this.http.get<Pickup[]>(this.api, { params });
  }

  create(data: any): Observable<Pickup> {
    return this.http.post<Pickup>(this.api, data);
  }

  updateStatus(id: string, status: Pickup['status']): Observable<Pickup> {
    return this.http.patch<Pickup>(`${this.api}/${id}/status`, { status });
  }

  cancel(id: string): Observable<Pickup> {
    return this.http.patch<Pickup>(`${this.api}/${id}/cancel`, {});
  }
}
~~~
## frontend/src/app/services/realtime.service.ts

~~~typescript
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket?: Socket;
  private messagesSubject = new Subject<any>();
  private notificationsSubject = new Subject<void>();

  readonly messages$: Observable<any> = this.messagesSubject.asObservable();
  readonly notifications$: Observable<void> = this.notificationsSubject.asObservable();

  constructor(private auth: AuthService) {}

  connect() {
    const token = this.auth.getToken();
    if (!token || this.socket?.connected) return;

    this.socket = io('http://localhost:5000', { auth: { token } });
    this.socket.on('message:new', (message) => this.messagesSubject.next(message));
    this.socket.on('notification:new', () => this.notificationsSubject.next());
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}
~~~
## frontend/src/app/services/theme.service.ts

~~~typescript
import { Injectable } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme: AppTheme = 'light';

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    this.currentTheme = savedTheme === 'dark' ? 'dark' : 'light';
    this.applyTheme();
  }

  get theme(): AppTheme {
    return this.currentTheme;
  }

  toggle(): AppTheme {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
    return this.currentTheme;
  }

  private applyTheme(): void {
    document.documentElement.dataset['theme'] = this.currentTheme;
  }
}
~~~
## frontend/src/app/services/toast.service.ts

~~~typescript
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages = signal<ToastMessage[]>([]);
  private nextId = 1;

  show(message: string, type: ToastType = 'info'): void {
    const toast = { id: this.nextId++, message, type };
    this.messages.update((messages) => [...messages, toast]);

    setTimeout(() => this.dismiss(toast.id), 3500);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.messages.update((messages) => messages.filter((toast) => toast.id !== id));
  }
}
~~~
## frontend/src/app/shared/toast-host/toast-host.css

~~~css
.toast-stack {
  position: fixed;
  right: 22px;
  top: 22px;
  z-index: 2000;
  display: grid;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  border: 1px solid var(--border);
  border-left: 5px solid var(--green);
  border-radius: 12px;
  background: var(--surface);
  box-shadow: var(--shadow);
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  line-height: 1.35;
  padding: 14px 16px;
  text-align: left;
  animation: toastIn 0.22s ease both;
}

.toast.success {
  border-left-color: var(--green);
}

.toast.error {
  border-left-color: var(--danger);
}

.toast.info {
  border-left-color: #2b73b7;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 640px) {
  .toast-stack {
    left: 16px;
    right: 16px;
    top: 14px;
    width: auto;
  }
}
~~~
## frontend/src/app/shared/toast-host/toast-host.html

~~~html
<div class="toast-stack" aria-live="polite" aria-atomic="true">
  @for (toast of toastService.messages(); track toast.id) {
    <button
      class="toast"
      [class.success]="toast.type === 'success'"
      [class.error]="toast.type === 'error'"
      [class.info]="toast.type === 'info'"
      type="button"
      (click)="toastService.dismiss(toast.id)"
      aria-label="Dismiss notification"
    >
      <span>{{ toast.message }}</span>
    </button>
  }
</div>
~~~
## frontend/src/app/shared/toast-host/toast-host.ts

~~~typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-host.html',
  styleUrl: './toast-host.css',
})
export class ToastHost {
  constructor(public toastService: ToastService) {}
}
~~~
## frontend/src/index.html

~~~html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WasteZero</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
~~~
## frontend/src/main.ts

~~~typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
~~~
## frontend/src/styles.css

~~~css
:root {
  --green: #278a49;
  --green-dark: #123924;
  --green-mid: #317e4f;
  --green-light: #e7f5ec;
  --ink: #15231c;
  --muted: #627269;
  --border: #dfe9e3;
  --danger: #c62828;
  --app-bg: #f3f7f4;
  --surface: #ffffff;
  --surface-raised: #fbfdfb;
  --surface-hover: #eef6f1;
  --input-bg: #f9fbfa;
  --input-muted: #f0f3f0;
  --warning-bg: #fff3e0;
  --radius: 14px;
  --shadow-sm: 0 1px 2px rgba(20, 50, 35, 0.05);
  --shadow: 0 16px 44px rgba(18, 57, 36, 0.12);
}

:root[data-theme='dark'] {
  --green: #54c273;
  --green-dark: #b7f3c7;
  --green-mid: #73d48b;
  --green-light: rgba(84, 194, 115, 0.16);
  --ink: #eef8f1;
  --muted: #a8b8ae;
  --border: #294337;
  --danger: #ff8a80;
  --app-bg: #0f1712;
  --surface: #15221a;
  --surface-raised: #1a2a21;
  --surface-hover: #203529;
  --input-bg: #101b15;
  --input-muted: #1d2c23;
  --warning-bg: rgba(255, 180, 80, 0.13);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.28);
  --shadow: 0 16px 42px rgba(0, 0, 0, 0.35);
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  font-family: 'Segoe UI', Roboto, system-ui, -apple-system, sans-serif;
  color: var(--ink);
  background:
    linear-gradient(180deg, rgba(39, 138, 73, 0.05), transparent 240px),
    var(--app-bg);
  -webkit-font-smoothing: antialiased;
}

.auth-split {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(430px, 1.05fr) minmax(420px, 0.95fr);
  position: relative;
}

.auth-theme-toggle {
  position: fixed;
  right: 24px;
  top: 22px;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: var(--shadow-sm);
  color: #123924;
  cursor: pointer;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 800;
  padding: 10px 15px;
  transition: background 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}

.auth-theme-toggle:hover {
  background: #fff;
  transform: translateY(-1px);
}

.shell {
  background:
    linear-gradient(180deg, rgba(247, 251, 248, 0.9), rgba(243, 247, 244, 0.96)),
    url('/recycle-hero.jpg') center / cover fixed no-repeat !important;
}

:root[data-theme='dark'] .shell {
  background:
    linear-gradient(180deg, rgba(15, 23, 18, 0.92), rgba(15, 23, 18, 0.98)),
    url('/recycle-hero.jpg') center / cover fixed no-repeat !important;
}

.auth-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  color: #fff;
  background:
    linear-gradient(150deg, rgba(7, 37, 24, 0.92) 0%, rgba(26, 91, 50, 0.82) 55%, rgba(49, 126, 79, 0.72) 100%),
    url('/recycle-hero.jpg') center / cover no-repeat;
  overflow: hidden;
}
.auth-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.12) 42%, rgba(0, 0, 0, 0.24) 100%);
}
.auth-hero::after {
  content: '';
  position: absolute;
  width: 42%;
  height: 120%;
  right: -12%;
  top: -10%;
  background: rgba(255, 255, 255, 0.12);
  transform: rotate(9deg);
}
.hero-content {
  position: relative;
  max-width: 460px;
  z-index: 1;
}
.hero-logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  margin-bottom: 42px;
  padding: 8px 13px;
}
.hero-content h2 {
  font-size: 2.5rem;
  line-height: 1.14;
  margin: 0 0 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hero-content .lead {
  opacity: 0.9;
  font-size: 1.05rem;
  line-height: 1.65;
  margin: 0 0 34px;
}
.hero-points {
  list-style: none;
  padding: 0;
  margin: 0 0 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.hero-points li {
  display: flex;
  align-items: center;
  gap: 13px;
  font-weight: 500;
  font-size: 0.98rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.hero-points .tick {
  width: 27px;
  height: 27px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: grid;
  place-items: center;
  font-size: 0.78rem;
}
.hero-stats {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  max-width: 460px;
  margin-top: 6px;
}
.hero-stats div {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  padding: 16px 14px;
  backdrop-filter: blur(6px);
}
.hero-stats strong {
  display: block;
  font-size: 1.45rem;
  line-height: 1;
}
.hero-stats span {
  font-size: 0.78rem;
  opacity: 0.82;
}

.auth-form-side {
  display: grid;
  place-items: center;
  padding: 48px 30px;
  background:
    radial-gradient(circle at 80% 10%, rgba(39, 138, 73, 0.09), transparent 270px),
    var(--surface);
}
.auth-form {
  width: 100%;
  max-width: 430px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 34px;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.auth-form::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: linear-gradient(90deg, #2f9b55, #8fcf9e, #2b73b7);
}
.auth-head {
  margin-bottom: 28px;
}
.auth-badge {
  background: var(--green-light);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--green-dark) !important;
  display: inline-flex;
  font-size: 0.76rem !important;
  font-weight: 800;
  margin: 0 0 12px !important;
  padding: 6px 10px;
}
.auth-head .mini-logo {
  display: none;
}
.auth-head h1 {
  margin: 0 0 7px;
  font-size: 2rem;
  letter-spacing: -0.01em;
}
.auth-head p {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.field {
  margin-bottom: 17px;
}
.field label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 7px;
}
.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 13px 15px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.97rem;
  font-family: inherit;
  color: var(--ink);
  background: var(--input-bg);
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.field input::placeholder,
.field textarea::placeholder {
  color: #9fb0a7;
}
.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.12);
  background: var(--surface);
}

.password-wrap {
  position: relative;
}
.password-wrap input {
  padding-right: 48px;
}
.toggle-pass {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--green-dark);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 7px 9px;
  line-height: 1;
  border-radius: 9px;
}
.toggle-pass:hover {
  background: rgba(46, 125, 50, 0.1);
}

.btn-primary {
  width: 100%;
  padding: 14px;
  margin-top: 4px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #3da35b 0%, #175d35 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 12px 26px rgba(31, 107, 58, 0.25);
}

.field input:focus,
.field select:focus,
.field textarea:focus,
.auth-form:hover {
  transform: translateY(-1px);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(31, 107, 58, 0.4);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-alt {
  text-align: center;
  margin: 24px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}
.auth-alt a {
  color: var(--green);
  font-weight: 600;
  text-decoration: none;
}
.auth-alt a:hover {
  text-decoration: underline;
}
.forgot-link {
  color: var(--green);
  display: inline-block;
  font-size: 0.88rem;
  font-weight: 600;
  margin-top: 9px;
  text-decoration: none;
}
.forgot-link:hover {
  text-decoration: underline;
}
.auth-separator {
  color: #b9c7c0;
  margin: 0 8px;
}

.form-error {
  background: #fdecea;
  color: var(--danger);
  border: 1px solid #f5c6c2;
  padding: 11px 13px;
  border-radius: 11px;
  font-size: 0.88rem;
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
}
.form-row .field {
  flex: 1;
}

.auth-trust {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 16px;
}
.auth-trust span {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 9px 8px;
  text-align: center;
}

@media (max-width: 900px) {
  .auth-split {
    grid-template-columns: 1fr;
  }
  .auth-hero {
    display: none;
  }
  .auth-form-side {
    min-height: 100vh;
  background: var(--app-bg);
  }
  .auth-form {
    padding: 32px 24px;
  }
  .auth-trust {
    grid-template-columns: 1fr;
  }
  .auth-head .mini-logo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--green-dark);
    margin-bottom: 18px;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.75;
    transform: scale(1.12);
  }
}
@keyframes softSlide {
  from { opacity: 0; transform: translateX(18px); }
  to { opacity: 1; transform: none; }
}

.auth-hero::after {
  animation: glowPulse 7s ease-in-out infinite;
}
.hero-logo {
  animation: fadeUp 0.6s ease both;
}
.hero-content h2 {
  animation: fadeUp 0.6s ease 0.08s both;
}
.hero-content .lead {
  animation: fadeUp 0.6s ease 0.16s both;
}
.hero-points li {
  animation: fadeUp 0.55s ease both;
}
.hero-points li:hover {
  opacity: 0.95;
  transform: translateX(4px);
}
.hero-points li:nth-child(1) {
  animation-delay: 0.24s;
}
.hero-points li:nth-child(2) {
  animation-delay: 0.32s;
}
.hero-points li:nth-child(3) {
  animation-delay: 0.4s;
}
.hero-points li:nth-child(4) {
  animation-delay: 0.48s;
}
.hero-stats {
  animation: fadeUp 0.6s ease 0.56s both;
}
.hero-stats div {
  transition: transform 0.2s ease, background 0.2s ease;
}
.hero-stats div:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.17);
}

.auth-head {
  animation: fadeUp 0.5s ease both;
}
.auth-form form > * {
  animation: fadeUp 0.5s ease both;
}
.auth-form form > *:nth-child(1) {
  animation-delay: 0.08s;
}
.auth-form form > *:nth-child(2) {
  animation-delay: 0.15s;
}
.auth-form form > *:nth-child(3) {
  animation-delay: 0.22s;
}
.auth-form form > *:nth-child(4) {
  animation-delay: 0.29s;
}
.auth-form form > *:nth-child(5) {
  animation-delay: 0.36s;
}
.auth-form form > *:nth-child(6) {
  animation-delay: 0.43s;
}
.auth-form .auth-alt {
  animation: fadeUp 0.5s ease 0.5s both;
}
.auth-trust span {
  animation: softSlide 0.45s ease both;
}
.auth-trust span:nth-child(2) {
  animation-delay: 0.08s;
}
.auth-trust span:nth-child(3) {
  animation-delay: 0.16s;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}

:root[data-theme='dark'] .auth-form {
  background: rgba(21, 34, 26, 0.92) !important;
}

:root[data-theme='dark'] .auth-form-side {
  background:
    radial-gradient(circle at 80% 10%, rgba(84, 194, 115, 0.13), transparent 270px),
    var(--app-bg) !important;
}

:root[data-theme='dark'] .auth-hero {
  background:
    linear-gradient(150deg, rgba(3, 18, 12, 0.94) 0%, rgba(18, 57, 36, 0.9) 55%, rgba(41, 91, 60, 0.78) 100%),
    url('/recycle-hero.jpg') center / cover no-repeat !important;
}

:root[data-theme='dark'] .auth-theme-toggle {
  background: rgba(21, 34, 26, 0.9);
  border-color: var(--border);
  color: var(--ink);
}

:root[data-theme='dark'] .profile-card,
:root[data-theme='dark'] .form-card,
:root[data-theme='dark'] .card,
:root[data-theme='dark'] .panel,
:root[data-theme='dark'] .details-card,
:root[data-theme='dark'] .state-card,
:root[data-theme='dark'] .empty,
:root[data-theme='dark'] .stat-card,
:root[data-theme='dark'] .impact-card,
:root[data-theme='dark'] .action-card,
:root[data-theme='dark'] .summary-card {
  background: var(--surface) !important;
  border-color: var(--border) !important;
  color: var(--ink) !important;
}

:root[data-theme='dark'] input,
:root[data-theme='dark'] select,
:root[data-theme='dark'] textarea {
  background: var(--input-bg) !important;
  border-color: var(--border) !important;
  color: var(--ink) !important;
}

:root[data-theme='dark'] input[readonly] {
  background: var(--input-muted) !important;
}

:root[data-theme='dark'] input::placeholder,
:root[data-theme='dark'] textarea::placeholder {
  color: #7d9286 !important;
}

:root[data-theme='dark'] .btn-outline,
:root[data-theme='dark'] .btn-edit,
:root[data-theme='dark'] .btn-cancel {
  background: var(--surface-raised) !important;
  border-color: var(--border) !important;
  color: var(--ink) !important;
}

:root[data-theme='dark'] .otp-info,
:root[data-theme='dark'] .role-badge,
:root[data-theme='dark'] .skill-list span {
  background: var(--green-light) !important;
  border-color: var(--border) !important;
  color: var(--ink) !important;
}

:root[data-theme='dark'] .alert.success,
:root[data-theme='dark'] .form-success {
  background: rgba(84, 194, 115, 0.16) !important;
  border-color: rgba(84, 194, 115, 0.35) !important;
  color: #b7f3c7 !important;
}

:root[data-theme='dark'] .alert.error,
:root[data-theme='dark'] .form-error {
  background: rgba(255, 138, 128, 0.12) !important;
  border-color: rgba(255, 138, 128, 0.35) !important;
  color: #ffb5ae !important;
}
~~~
## frontend/tsconfig.app.json

~~~json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}
~~~
## frontend/tsconfig.json

~~~json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "preserve"
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  },
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ]
}
~~~
## frontend/tsconfig.spec.json

~~~json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "vitest/globals"
    ]
  },
  "include": [
    "src/**/*.d.ts",
    "src/**/*.spec.ts"
  ]
}
~~~
